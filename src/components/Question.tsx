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
    QuestionType.Section,
    QuestionType.Range
];

export type QuestionProp = {
    question: Question,
    public_state: Map<string, string | boolean | null>,
    scroll_ref: React.RefObject<HTMLDivElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    focus_ref: React.RefObject<any>
}

class RenderedQuestion extends React.Component<QuestionProp> {
    constructor(props: QuestionProp) {
        super(props);
        if (props.question.type === QuestionType.TextArea) {
            this.handler = this.text_area_handler.bind(this);
        } else if (props.question.type === QuestionType.Code) {
            this.handler = this.code_field_handler.bind(this);
        } else {
            this.handler = this.normal_handler.bind(this);
        }
        this.blurHandler = this.blurHandler.bind(this);

        this.setPublicState("valid", true);
        this.setPublicState("error", "");

        if (!skip_normal_state.includes(props.question.type)) {
            this.setPublicState("value", "");
        }
    }

    setPublicState(target: string, value: string | boolean | null, callback?:() => void): void {
        this.setState({[target]: value}, callback);
        this.props.public_state.set(target, value);
    }

    // This is here to allow dynamic selection between the general handler, textarea, and code field handlers.
    handler(_: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string): void {} // eslint-disable-line

    blurHandler(): void {
        if (this.props.question.required) {
            if (!this.props.public_state.get("value")) {
                this.setPublicState("error", "Field must be filled.");
                this.setPublicState("valid", false);
            } else {
                this.setPublicState("error", "");
                this.setPublicState("valid", true);
            }
        }
    }

    normal_handler(event: ChangeEvent<HTMLInputElement>): void {
        let target: string;
        let value: string | boolean;

        switch (event.target.type) {
            case "checkbox":
                target = event.target.name;
                value = event.target.checked;
                break;

            case "radio":
            // This handles radios and ranges, as they are both based on the same fundamental input type
                target = "value";
                if (event.target.parentElement) {
                    value = event.target.parentElement.innerText.trimEnd();
                } else {
                    value = event.target.value;
                }
                break;

            default:
                target = "value";
                value = event.target.value;
        }

        this.setPublicState(target, value);

        // Toggle checkbox class
        if (event.target.type == "checkbox" && event.target.parentElement !== null) {
            event.target.parentElement.classList.toggle("unselected");
            event.target.parentElement.classList.toggle("selected");
        }

        const options: string | string[] = this.props.question.data["options"];
        switch (event.target.type) {
            case "text":
                this.setPublicState("valid", true);
                break;

            case "checkbox":
                // We need to check this here, because checkbox doesn't have onBlur
                if (this.props.question.required && typeof options !== "string") {
                    const keys: string[] = [];
                    options.forEach((val, index) => {
                        keys.push(`${("000" + index).slice(-4)}. ${val}`);
                    });
                    if (keys.every(v => !this.props.public_state.get(v))) {
                        this.setPublicState("error", "Field must be filled.");
                        this.setPublicState("valid", false);
                    } else {
                        this.setPublicState("error", "");
                        this.setPublicState("valid", true);
                    }
                }
                break;

            case "radio":
                this.setPublicState("valid", true);
                this.setPublicState("error", "");
                break;
        }
    }

    text_area_handler(event: ChangeEvent<HTMLTextAreaElement>): void {
        // We will validate again when focusing out.
        this.setPublicState("valid", true);
        this.setPublicState("error", "");

        this.setPublicState("value", event.target.value);
    }

    code_field_handler(newContent: string): void {
        // If content stays same (what means that user have just zoomed in), then don't validate.
        let validate = false;
        if (newContent != this.props.public_state.get("value")) {
            validate = true;
        }

        this.setPublicState("value", newContent);

        // CodeMirror don't provide onBlur event, so we have to run validation here.
        if (validate) {
            this.blurHandler();
        }
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
            case QuestionType.Code:
                if (this.props.public_state.get("value") === "") {
                    invalid = true;
                }
                break;

            case QuestionType.Select:
            case QuestionType.Range:
            case QuestionType.Radio:
                if (!this.props.public_state.get("value")) {
                    invalid = true;
                }
                break;

            case QuestionType.Checkbox:
                if (typeof options !== "string") {
                    const keys: string[] = [];
                    options.forEach((val, index) => {
                        keys.push(`${("000" + index).slice(-4)}. ${val}`);
                    });
                    if (keys.every(v => !this.props.public_state.get(v))) {
                        invalid = true;
                    }
                }
                break;
        }

        if (invalid) {
            this.setPublicState("error", "Field must be filled.");
            this.setPublicState("valid", false);
        } else {
            this.setPublicState("error", "");
            this.setPublicState("valid", true);
        }
    }

    componentDidMount(): void {
        // Initialize defaults for complex and nested fields
        const options: string | string[] = this.props.question.data["options"];

        if (this.props.public_state.size === 0) {
            switch (this.props.question.type) {
                case QuestionType.Checkbox:
                    if (typeof options === "string") {
                        return;
                    }

                    options.forEach((option, index) => {
                        this.setPublicState(`${("000" + index).slice(-4)}. ${option}`, false);
                    });
                    break;

                case QuestionType.Range:
                case QuestionType.Radio:
                case QuestionType.Select:
                    this.setPublicState("value", null);
                    break;
            }
        }
    }

    render(): JSX.Element {
        const question = this.props.question;

        const name = question.name.split("\n").map((line, index) => <span key={index}>{line}<br/></span>);
        name.push(<span key={name.length - 1}>{name.pop()?.props.children[0]}</span>);

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
            let valid = true;
            if (!this.props.public_state.get("valid")) {
                valid = false;
            }
            const rawError = this.props.public_state.get("error");
            let error = "";
            if (typeof rawError === "string") {
                error = rawError;
            }

            return <div ref={this.props.scroll_ref}>
                <h2 css={[selectable, requiredStarStyles]}>
                    {name}<span css={css`display: none;`} className={question.required ? "required" : ""}>*</span>
                </h2>
                { create_input(this.props, this.handler, this.blurHandler, this.props.focus_ref) }
                <ErrorMessage show={!valid} message={error} />
                <hr css={css`color: gray; margin: 3rem 0;`}/>
            </div>;
        }
    }
}

export default RenderedQuestion;
