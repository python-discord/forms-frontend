/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

import { Question, QuestionType } from "../api/question";
import create_input from "./InputTypes"

const _skip_normal_state: Array<QuestionType> = [
    QuestionType.Radio,
    QuestionType.Checkbox,
    QuestionType.Select,
    QuestionType.Section,
    QuestionType.Range
];

export type QuestionProp = {
    question: Question,
    public_state: Map<string, any>,
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

    _setState(target: string, value: any, callback?:() => void): void {
        this.setState({[target]: value}, callback);
        this.props.public_state.set(target, value);
    }

    handler(_: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {}

    normal_handler(event: ChangeEvent<HTMLInputElement>): void {
        let target: string;
        let value: string | boolean;

        switch (event.target.type) {
            case QuestionType.Checkbox:
                target = this.props.question.id;
                value = event.target.checked;
                break;

            case QuestionType.Radio:
                target = "value";
                if (event.target.parentElement) {
                    value = event.target.parentElement.innerText.trimEnd();
                } else {
                    value = event.target.value;
                }
                break;

            case QuestionType.Select:
                // Handled by component
                return;

            default:
                target = "value";
                value = event.target.value;
        }

        this._setState(target, value);

        // Toggle checkbox class
        if (event.target.type == "checkbox" && event.target.parentElement !== null) {
            event.target.parentElement.classList.toggle("unselected_checkbox_label");
            event.target.parentElement.classList.toggle("selected_checkbox_label");
        }
    }

    text_area_handler(event: ChangeEvent<HTMLTextAreaElement>) {
        this._setState("value", event.target.value);
    }

    componentDidMount() {
        // Initialize defaults for complex and nested fields
        if (this.props.public_state.size === 0) {
            switch (this.props.question.type) {
                case QuestionType.Checkbox:
                    for (const [index, option] of this.props.question.data["options"].entries()) {
                        this._setState(`${("000" + index).slice(-4)}. ${option}`, false);
                    }
                    break;

                case QuestionType.Range:
                case QuestionType.Radio:
                case QuestionType.Select:
                    this._setState("value", null)
                    break;
            }
        }
    }

    render() {
        const question = this.props.question;

        if (question.type === QuestionType.Section) {
            return <div>
                <h1 className="selectable">{question.name}</h1>
                { question.data["text"] ? <h3>{question.data["text"]}</h3> : "" }
                <hr className="section_header"/>
            </div>
        } else {
            return <div>
                <h2 className="selectable">{question.name}</h2>
                { create_input(this.props, this.handler) }<hr/>
            </div>
        }
    }
}

export default RenderedQuestion;
