/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";
import { connect } from "react-redux";

import { Question, QuestionType } from "../api/question";
import { selectable } from "../commonStyles";
import create_input from "./InputTypes";
import ErrorMessage from "./ErrorMessage";
import { FormState } from "../store/form/types";
import { setError, SetErrorAction, setValid, SetValidAction, setValue, SetValueAction } from "../store/form/actions";

const skip_normal_state: Array<QuestionType> = [
    QuestionType.Radio,
    QuestionType.Checkbox,
    QuestionType.Select,
    QuestionType.Section,
    QuestionType.Range
];

export type QuestionProp = {
    question: Question,
    scroll_ref: React.RefObject<HTMLDivElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    focus_ref: React.RefObject<any>
}

export type QuestionStateProp = {
    values: Map<string, string | Map<string, boolean> | null>,
    errors: Map<string, string>,
    valid: Map<string, boolean>,
};

export type QuestionDispatchProp = {
    setValue: (question: Question, value: string | Map<string, boolean> | null) => SetValueAction,
    setValid: (question: Question, valid: boolean) => SetValidAction,
    setError: (question: Question, error: string) => SetErrorAction
};

export class RenderedQuestion extends React.Component<QuestionProp & QuestionStateProp & QuestionDispatchProp> {
    constructor(props: QuestionProp & QuestionStateProp & QuestionDispatchProp) {
        super(props);
        if (props.question.type === QuestionType.TextArea) {
            this.handler = this.text_area_handler.bind(this);
        } else {
            this.handler = this.normal_handler.bind(this);
        }
        this.blurHandler = this.blurHandler.bind(this);

        props.setValid(props.question, true);
        props.setError(props.question, "");

        if (!skip_normal_state.includes(props.question.type)) {
            props.setValue(props.question, "");
        }
    }

    // This is here to allow dynamic selection between the general handler, and the textarea handler.
    handler(_: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {} // eslint-disable-line

    blurHandler(): void {
        if (this.props.question.required) {
            if (!this.props.values.get(this.props.question.id)) {
                this.props.setError(this.props.question, "Field must be filled.");
                this.props.setValid(this.props.question, false);
            } else {
                this.props.setError(this.props.question, "");
                this.props.setValid(this.props.question, true);
            }
        }
    }

    normal_handler(event: ChangeEvent<HTMLInputElement>): void {
        let value: string | [string, boolean];

        switch (event.target.type) {
            case "checkbox":
                value = [event.target.name, event.target.checked];
                break;

            case "radio":
                // This handles radios and ranges, as they are both based on the same fundamental input type
                if (event.target.parentElement) {
                    value = event.target.parentElement.innerText.trimEnd();
                } else {
                    value = event.target.value;
                }
                break;

            default:
                value = event.target.value;
        }

        if (value instanceof Array) {
            let values = this.props.values.get(this.props.question.id);
            if (!(values instanceof Map)) {
                values = new Map<string, boolean>();
            }
            values.set(value[0], value[1]);
            this.props.setValue(this.props.question, values);
        } else {
            this.props.setValue(this.props.question, value);
        }

        // Toggle checkbox class
        if (event.target.type == "checkbox" && event.target.parentElement !== null) {
            event.target.parentElement.classList.toggle("unselected");
            event.target.parentElement.classList.toggle("selected");
        }

        const options: string | string[] = this.props.question.data["options"];
        switch (event.target.type) {
            case "text":
                this.props.setValid(this.props.question, true);
                break;

            case "checkbox":
                // We need to check this here, because checkbox doesn't have onBlur
                if (this.props.question.required && typeof options !== "string") {
                    const keys: string[] = [];
                    options.forEach((val, index) => {
                        keys.push(`${("000" + index).slice(-4)}. ${val}`);
                    });
                    const values = this.props.values.get(this.props.question.id);
                    if (values instanceof Map && keys.every(v => !values.get(v))) {
                        this.props.setError(this.props.question, "Field must be filled.");
                        this.props.setValid(this.props.question, false);
                    } else {
                        this.props.setError(this.props.question, "");
                        this.props.setValid(this.props.question, true);
                    }
                }
                break;

            case "radio":
                this.props.setError(this.props.question, "");
                this.props.setValid(this.props.question, true);
                break;
        }
    }

    text_area_handler(event: ChangeEvent<HTMLTextAreaElement>): void {
        // We will validate again when focusing out.
        this.props.setError(this.props.question, "");
        this.props.setValid(this.props.question, true);

        this.props.setValue(this.props.question, event.target.value);
    }

    validateField(): void {
        if (!this.props.question.required) {
            return;
        }

        let invalid = false;
        const options: string | string[] = this.props.question.data["options"];
        switch (this.props.question.type) {
            case QuestionType.TextArea:
            case QuestionType.ShortText:
                if (this.props.values.get(this.props.question.id) === "") {
                    invalid = true;
                }
                break;

            case QuestionType.Select:
            case QuestionType.Range:
            case QuestionType.Radio:
                if (!this.props.values.get(this.props.question.id)) {
                    invalid = true;
                }
                break;

            case QuestionType.Checkbox:
                if (typeof options !== "string") {
                    const keys: string[] = [];
                    options.forEach((val, index) => {
                        keys.push(`${("000" + index).slice(-4)}. ${val}`);
                    });
                    const values = this.props.values.get(this.props.question.id);
                    if (values instanceof Map && keys.every(v => !values.get(v))) {
                        invalid = true;
                    }
                }
                break;
        }

        if (invalid) {
            this.props.setError(this.props.question, "Field must be filled.");
            this.props.setValid(this.props.question, false);
        } else {
            this.props.setError(this.props.question, "");
            this.props.setValid(this.props.question, true);
        }
    }

    componentDidMount(): void {
        // Initialize defaults for complex and nested fields
        const options: string | string[] = this.props.question.data["options"];
        const values = this.props.values.get(this.props.question.id);

        switch (this.props.question.type) {
            case QuestionType.Checkbox:
                if (typeof options === "string" || !(values instanceof Map)) {
                    return;
                }

                options.forEach((option, index) => {
                    values.set(`${("000" + index).slice(-4)}. ${option}`, false);
                });
                this.props.setValue(this.props.question, values);
                break;

            case QuestionType.Range:
            case QuestionType.Radio:
            case QuestionType.Select:
                this.props.setValue(this.props.question, null);
                break;
        }
    }

    render(): JSX.Element {
        const question = this.props.question;

        if (question.type === QuestionType.Section) {
            const styles = css`
              h1 {
                margin-bottom: 0;
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

            return <div css={styles}>
                <h1 css={[selectable, css`line-height: 2.5rem;`]}>{question.name}</h1>
                { question.data["text"] ? <h3 css={selectable}>{question.data["text"]}</h3> : "" }
                <hr css={css`color: gray; margin: 3rem 0;`}/>
            </div>;

        } else {
            const requiredStarStyles = css`
              span {
                display: none;
              }

              .required {
                display: inline-block;
                position: relative;

                color: red;

                top: -0.2rem;
                margin-left: 0.2rem;
              }
            `;
            let valid = true;
            if (!this.props.valid.get(this.props.question.id)) {
                valid = false;
            }
            const rawError = this.props.errors.get(this.props.question.id);
            let error = "";
            if (typeof rawError === "string") {
                error = rawError;
            }

            return <div ref={this.props.scroll_ref}>
                <h2 css={[selectable, requiredStarStyles]}>
                    {question.name}<span className={question.required ? "required" : ""}>*</span>
                </h2>
                { create_input(this.props, this.handler, this.blurHandler, this.props.focus_ref) }
                <ErrorMessage show={!valid} message={error} />
                <hr css={css`color: gray; margin: 3rem 0;`}/>
            </div>;
        }
    }
}

const mapStateToProps = (state: FormState, ownProps: QuestionProp): QuestionProp & QuestionStateProp => {
    return {
        ...ownProps,
        values: state.values,
        errors: state.errors,
        valid: state.valid
    };
};

const mapDispatchToProps = {
    setValue,
    setValid,
    setError
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(RenderedQuestion);
