import React, {SyntheticEvent} from "react";
import * as Sentry from "@sentry/react";

import RenderedQuestion from "../../components/Question";
import {RefMapType} from "./FormPage";

import ApiClient from "../../api/client";
import {Question, QuestionType, UnittestFailure} from "../../api/question";
import {checkScopes, OAuthScopes} from "../../api/auth";


export enum FormState {
    INITIAL = "initial",
    SENDING = "sending",
    SENT = "sent",
    VALIDATION_ERROR = "validation_error",
    UNKNOWN_ERROR = "error",
}


/**
 * Handle validation and submission of a form.
 *
 * @param event The submission event.
 * @param formID The form ID.
 * @param questions A list of :RenderedQuestion: elements.
 * @param refMap A map of question ID to object refs.
 * @param setState A consumer which marks the current state of the form.
 * @param OAuthRef A reference to the OAuth button to scroll to if the user is not logged in.
 * @param scopes The OAuth scopes required to submit the form.
 */
export default async function handleSubmit(
    event: SyntheticEvent,
    formID: string,
    questions: RenderedQuestion[],
    refMap: RefMapType,
    setState: (state: string) => void,
    OAuthRef: React.RefObject<HTMLDivElement>,
    scopes: OAuthScopes[]
): Promise<void> {
    try {
        event.preventDefault();

        if (scopes.length && !checkScopes(scopes)) {
            // The form requires certain scopes, but the user is not logged in
            if (!OAuthRef.current) {
                Sentry.captureMessage("OAuthRef was not set, could not scroll to the button.");
            } else {
                OAuthRef.current.scrollIntoView({behavior: "smooth", block: "end"});
            }

            return;
        }

        if (!validate(questions, refMap)) {
            return;
        }

        // FIXME: Save state while sending
        // setState(FormState.SENDING);

        await ApiClient.post(`forms/submit/${formID}`, {response: parseAnswers(questions)})
            .then(() => setState(FormState.SENT))
            .catch(error => {
                if (!error.response) {
                    throw error;
                }

                switch (error.response.status) {
                    case 422:
                        // TODO: Re-enable this once we have better state management
                        // setState(FormState.VALIDATION_ERROR);
                        showUnitTestFailures(refMap, error.response.data);
                        break;

                    case 500:
                    default:
                        throw error;
                }
            });

    } catch (e) {
        // Send exception to sentry, and display an error page
        Sentry.captureException(e);
        console.error(e);
        setState(FormState.UNKNOWN_ERROR);
    }
}


/**
 * Parse submission errors on unittests, and set up the environment for displaying the errors.
 */
function showUnitTestFailures(refMap: RefMapType, errors: UnittestFailure) {
    for (const error of errors.test_results) {
        const questionRef = refMap.get(error.question_id);

        if (!questionRef?.current) {
            throw new Error("Could not find question reference while verifying unittest failure.");
        }

        questionRef.current.setPublicState("valid", false);
        questionRef.current.setPublicState("unittestsFailed", true);
        questionRef.current.setPublicState("testFailure", error.return_code === 0);
        questionRef.current.setPublicState("error", error.result);
    }
}

/**
 * Run client side validation.
 */
function validate(questions: RenderedQuestion[], refMap: RefMapType): boolean {
    const invalidFieldIDs: number[] = [];
    questions.forEach((prop, i) => {
        const question: Question = prop.props.question;
        if (!question.required) {
            return;
        }

        const questionRef = refMap.get(question.id);
        if (questionRef && questionRef.current) {
            questionRef.current.validateField();
        }

        // In case when field is invalid, add this to invalid fields list.
        if (prop.props.public_state.get("valid") === false) {
            invalidFieldIDs.push(i);
        }
    });

    if (invalidFieldIDs.length) {
        const firstErrored = questions[invalidFieldIDs[0]];
        if (firstErrored && firstErrored.props.scroll_ref) {
            // If any element is already focused, unfocus it to avoid not scrolling behavior.
            if (document.activeElement && document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            firstErrored.props.scroll_ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
            if (firstErrored.props.focus_ref && firstErrored.props.focus_ref.current) {
                firstErrored.props.focus_ref.current.focus({ preventScroll: true });
            }
        }

        return false;
    }

    return true;
}

/**
 * Parse user answers into a valid submission.
 */
function parseAnswers(questions: RenderedQuestion[]): { [key: string]: unknown } {
    const answers: { [key: string]: unknown } = {};

    questions.forEach(prop => {
        const question: Question = prop.props.question;
        const options: string | string[] = question.data["options"];

        // Parse input from each question
        switch (question.type) {
            case QuestionType.Section:
                answers[question.id] = false;
                break;

            case QuestionType.Checkbox: {
                if (typeof options !== "string") {
                    const keys: Map<string, string> = new Map();
                    options.forEach((val: string, index) => {
                        keys.set(val, `${("000" + index).slice(-4)}. ${val}`);
                    });
                    const pairs: { [key: string]: boolean } = { };
                    keys.forEach((val, key) => {
                        pairs[key] = !!prop.props.public_state.get(val);
                    });
                    answers[question.id] = pairs;
                }
                break;
            }

            default:
                answers[question.id] = prop.props.public_state.get("value");
        }
    });

    return answers;
}
