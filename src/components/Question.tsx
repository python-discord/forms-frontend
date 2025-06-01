/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";

import { Question, QuestionType } from "../api/question";
import { selectable } from "../commonStyles";
import create_input from "./InputTypes";
import ErrorMessage from "./ErrorMessage";

const skip_normal_state: Array<QuestionType> = [
    QuestionType.Radio,
    QuestionType.Checkbox,
    QuestionType.Select,
    QuestionType.TimeZone,
    QuestionType.Section,
    QuestionType.Range,
    QuestionType.Vote
];

export interface QuestionState {
    // Common keys
    value: string | null | Map<string, boolean> | Record<string, number | null>

    // Validation
    valid: boolean
    error: string

    // Unittest-specific validation
    unittestsFailed: boolean  // This indicates a failure in testing when submitting (i.e not from common validation)
    testFailure: boolean  // Whether we had failed unittests, or other failures, such as code loading
}

export type QuestionProp = {
    question: Question,
    scroll_ref: React.RefObject<HTMLDivElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    focus_ref: React.RefObject<any>,
    selfRef: React.RefObject<RenderedQuestion>,
}

class RenderedQuestion extends React.Component<QuestionProp> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: TS2610
    state: QuestionState;

    /** The current state of the question components, which may or may not match the state rendered. */
    public realState: QuestionState;

    setState(state: Partial<QuestionState>): void {
        this.realState = {...this.realState, ...state};
        super.setState(state);
    }

    constructor(props: QuestionProp) {
        super(props);
        if (props.question.type === QuestionType.TextArea) {
            this.handler = this.text_area_handler.bind(this);
        } else if (props.question.type === QuestionType.Code) {
            this.handler = this.code_field_handler.bind(this);
        } else if (props.question.type === QuestionType.Vote) {
            this.handler = this.vote_handler.bind(this);
        } else {
            this.handler = this.normal_handler.bind(this);
        }
        this.blurHandler = this.blurHandler.bind(this);

        this.state = {
            value: skip_normal_state.includes(props.question.type) ? null : "",
            valid: true,
            error: "",

            unittestsFailed: false,
            testFailure: false,
        };

        this.realState = this.state;
    }

    // This is here to allow dynamic selection between the general handler, textarea, and code field handlers.
    handler(_: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | Record<string, number | null>): void {} // eslint-disable-line

    blurHandler(): void {
        if (this.props.question.required) {
            if (!this.realState.value) {
                this.setState({
                    error: "Field must be filled.",
                    valid: false
                });
            } else {
                this.setState({
                    error: "",
                    valid: true,
                    unittestsFailed: false
                });
            }
        }
    }

    normal_handler(event: ChangeEvent<HTMLInputElement>): void {
        switch (event.target.type) {
            case "checkbox":
                if (!(this.realState.value instanceof Map)) return;
                this.realState.value.set(event.target.name, event.target.checked);
                break;

            case "radio": {
                // This handles radios and ranges, as they are both based on the same fundamental input type
                let value;
                if (event.target.parentElement) {
                    value = event.target.parentElement.innerText.trimEnd();
                } else {
                    value = event.target.value;
                }
                this.setState({value: value});
                break;
            }

            default:
                this.setState({value: event.target.value});
        }

        // Toggle checkbox class
        if (event.target.type === "checkbox" && event.target.parentElement !== null) {
            event.target.parentElement.classList.toggle("unselected");
            event.target.parentElement.classList.toggle("selected");
        }

        const options: string | string[] = this.props.question.data["options"];
        switch (event.target.type) {
            case "text":
                this.setState({valid: true});
                break;

            case "checkbox":
                // We need to check this here, because checkbox doesn't have onBlur
                if (this.props.question.required && typeof options !== "string") {
                    if (!(this.realState.value instanceof Map)) return;
                    const valid = Array.from(this.realState.value.values()).includes(true);
                    this.setState({
                        error: valid ? "" : "Field must be filled.",
                        valid: valid
                    });
                }

                break;

            case "radio":
                this.setState({
                    valid: true,
                    error: ""
                });
                break;
        }
    }

    vote_handler(event: Record<string, number | null>) {
        this.setState({
            value: event,
            valid: true,
            error: ""
        });
    }

    text_area_handler(event: ChangeEvent<HTMLTextAreaElement>): void {
        // We will validate again when focusing out.
        this.setState({
            value: event.target.value,
            valid: true,
            error: ""
        });
    }

    code_field_handler(newContent: string): void {
        // If content stays same (what means that user have just zoomed in), then don't validate.
        let validate = false;
        if (newContent != this.realState.value) {
            validate = true;
        }

        this.setState({value: newContent});

        // CodeMirror don't provide onBlur event, so we have to run validation here.
        if (validate) {
            this.blurHandler();
        }
    }

    validateField(): void {
        if (!this.props.question.required) {
            return;
        }

        let valid = true;
        const options: string | string[] = this.props.question.data["options"];

        switch (this.props.question.type) {
            case QuestionType.TextArea:
            case QuestionType.ShortText:
            case QuestionType.Code:
                if (this.realState.value === "") {
                    valid = false;
                }
                break;

            case QuestionType.Select:
            case QuestionType.Range:
            case QuestionType.TimeZone:
            case QuestionType.Vote:
            case QuestionType.Radio:
                if (!this.realState.value) {
                    valid = false;
                }
                break;

            case QuestionType.Checkbox:
                if (typeof options !== "string") {
                    if (!(this.realState.value instanceof Map)) return;
                    valid = Array.from(this.realState.value.values()).includes(true);
                }
                break;
        }

        this.setState({
            error: valid ? "" : "Field must be filled",
            valid: valid
        });
    }

    componentDidMount(): void {
        // Initialize defaults for complex and nested fields
        const options: string | string[] = this.props.question.data["options"];

        switch (this.props.question.type) {
            case QuestionType.Checkbox:
                if (typeof options === "string") return;
                this.setState({
                    value: new Map(options.map((option, index) =>
                        [`${("000" + index).slice(-4)}. ${option}`, false]
                    ))
                });
                break;
        }
    }

    generateUnitTestErrorMessage(): JSX.Element {
        let inner;

        if (this.realState.testFailure) {
            inner = <div>
                {"Unittest Failure:\n"}
                <ul css={css`font-size: 1rem;`}>
                    {this.realState.error.split(";").map(testName =>
                        <li css={css`letter-spacing: 0.5px;`} key={testName}>{testName}</li>
                    )}
                </ul>
            </div>;
        } else {
            inner = `Unittest Failure:\n\n${this.realState.error}`;
        }

        const element = <div css={css`white-space: pre-wrap; word-wrap: break-word;`}>{inner}</div>;
        return <ErrorMessage show={!this.realState.valid} content={element}/>;
    }

    render(): JSX.Element {
        const question = this.props.question;

        const name = question.name.split("\n").map((line, index) => <span key={index}>{line}<br/></span>);
        name.push(<span key={name.length - 1}>{name.pop()?.props.children[0]}</span>);

        if (question.type === QuestionType.Section) {
            let styles = css`
              h1 {
                margin-bottom: 0.5rem;
              }

              h3 {
                margin-top: 0;
              }

              h1, h3 {
                text-align: center;
                padding: 0 2rem;
              }

              @media (max-width: 500px) {
                h1, h3 {
                  padding: 0;
                }
              }
            `;

            if (question.data["align"] === "left") {
                styles = css`
                    ${styles};

                    h1, h3 {
                        text-align: left;
                        padding: 0 0rem;
                    }
                `;
            };

            const data = question.data["text"];
            let text;

            if (data && typeof(data) === "string") {
                text = data.split("\n").map((line, index) => <h3 css={selectable} key={index}>{line}<br/></h3>);
                text.push(<h3 css={selectable} key={data.length - 1}>{text.pop()?.props.children[0]}</h3>);
            } else {
                text = "";
            }

            return <div css={styles}>
                <h1 css={[selectable, css`line-height: 2.5rem;`]}>{name}</h1>
                { text }
                <hr css={css`color: gray; margin: 3rem 0;`}/>
            </div>;

        } else {
            const requiredStarStyles = css`
              .required {
                display: inline-block;
                position: relative;

                color: red;

                top: -0.2rem;
                margin-left: 0.2rem;
              }
            `;
            let error;
            if (this.props.question.type === QuestionType.Code && this.realState.unittestsFailed) {
                error = this.generateUnitTestErrorMessage();
            } else {
                error = <ErrorMessage show={!this.realState.valid} content={this.realState.error}/>;
            }

            return <div ref={this.props.scroll_ref}>
                <h2 css={[selectable, requiredStarStyles]}>
                    {name}<span css={css`display: none;`} className={question.required ? "required" : ""}>*</span>
                </h2>
                { create_input(this, this.handler, this.blurHandler, this.props.focus_ref) }
                {error}
                <hr css={css`color: gray; margin: 3rem 0;`}/>
            </div>;
        }
    }
}

export default RenderedQuestion;
