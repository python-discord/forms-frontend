/* eslint-disable @typescript-eslint/no-empty-function */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent, FocusEvent } from "react";

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
}

class RenderedQuestion extends React.Component<QuestionProp> {
    constructor(props: QuestionProp) {
        super(props);
        if (props.question.type === QuestionType.TextArea) {
            this.handler = this.text_area_handler.bind(this);
            this.blurHandler = this.on_blur_textarea_handler.bind(this);
        } else {
            this.handler = this.normal_handler.bind(this);
            if (props.question.type === QuestionType.Select) {
                this.blurHandler = this.on_blur_select_handler.bind(this);
            } else {
                this.blurHandler = this.on_blur_handler.bind(this);
            }
        }
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

    // This is here to allow dynamic selection between the general handler, and the textarea handler.
    handler(_: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {} // eslint-disable-line
    blurHandler(_: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement>): void {} // eslint-disable-line

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

        switch (event.target.type) {
            case "text":
                this.setPublicState("valid", true);
                break;
        }
    }

    text_area_handler(event: ChangeEvent<HTMLTextAreaElement>): void {
        // We will validate again when focusing out.
        this.setPublicState("valid", true);
        this.setPublicState("error", "");

        this.setPublicState("value", event.target.value);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    on_blur_handler(event: FocusEvent<HTMLInputElement>): void {
        if (this.props.question.required) {
            switch (event.target.type) {
                case "text":
                    if (event.target.value === "") {
                        this.setPublicState("error", "Field must be filled.");
                        this.setPublicState("valid", false);
                    }
                    break;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    on_blur_select_handler(_: FocusEvent<HTMLDivElement>): void {
        if (this.props.question.required && !this.props.public_state.get("value")) {
            this.setPublicState("error", "Field must be filled.");
            this.setPublicState("valid", false);
        } else {
            this.setPublicState("error", "");
            this.setPublicState("valid", true);
        }
    }

    on_blur_textarea_handler(event: FocusEvent<HTMLTextAreaElement>): void {
        if (this.props.question.required && event.target.value === "") {
            this.setPublicState("error", "Field must be filled.");
            this.setPublicState("valid", false);
        } else {
            this.setPublicState("valid", true);
            this.setPublicState("error", "");
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
            if (!this.props.public_state.get("valid")) {
                valid = false;
            }
            const rawError = this.props.public_state.get("error");
            let error = "";
            if (typeof rawError === "string") {
                error = rawError;
            }

            return <div>
                <h2 css={[selectable, requiredStarStyles]}>
                    {question.name}<span className={question.required ? "required" : ""}>*</span>
                </h2>
                { create_input(this.props, this.handler, this.blurHandler) }
                <ErrorMessage show={!valid} message={error} />
                <hr css={css`color: gray; margin: 3rem 0;`}/>
            </div>;
        }
    }
}

export default RenderedQuestion;
