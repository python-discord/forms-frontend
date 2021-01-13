/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";

import { Question, QuestionType } from "../api/question";
import { selectable } from "../commonStyles";
import create_input from "./InputTypes";

const _skip_normal_state: Array<QuestionType> = [
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
        } else {
            this.handler = this.normal_handler.bind(this);
        }

        if (!_skip_normal_state.includes(props.question.type)) {
            this._setState("value", "");
        }
    }

    _setState(target: string, value: string | boolean | null, callback?:() => void): void {
        this.setState({[target]: value}, callback);
        this.props.public_state.set(target, value);
    }

    // This is here to allow dynamic selection between the general handler, and the textarea handler.
    handler(_: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {} // eslint-disable-line

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

        this._setState(target, value);

        // Toggle checkbox class
        if (event.target.type == "checkbox" && event.target.parentElement !== null) {
            event.target.parentElement.classList.toggle("unselected");
            event.target.parentElement.classList.toggle("selected");
        }
    }

    text_area_handler(event: ChangeEvent<HTMLTextAreaElement>): void {
        this._setState("value", event.target.value);
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
                    this._setState(`${("000" + index).slice(-4)}. ${option}`, false);
                });
                break;

            case QuestionType.Range:
            case QuestionType.Radio:
            case QuestionType.Select:
                this._setState("value", null);
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
                <h1 css={selectable}>{question.name}</h1>
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

            return <div>
                <h2 css={[selectable, requiredStarStyles]}>
                    {question.name}<span className={question.required ? "required" : ""}>*</span>
                </h2>
                { create_input(this.props, this.handler) }
                <hr css={css`color: gray; margin: 3rem 0;`}/>
            </div>;
        }
    }
}

export default RenderedQuestion;
