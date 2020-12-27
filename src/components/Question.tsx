/** @jsx jsx */
import { jsx } from "@emotion/react";
import JSX = jsx.JSX;

import React, { ChangeEvent } from "react";
import { Question, QuestionType } from "../api/question";
import InputTypes from "./InputTypes/Index"

type QuestionProp = {
    question: Question,
    public_state: Map<string, any>,
}

const _require_options: Array<QuestionType> = [QuestionType.Radio, QuestionType.Checkbox, QuestionType.Select];
const _skip_normal_state: Array<QuestionType> = [QuestionType.Radio, QuestionType.Checkbox, QuestionType.Select];

// TODO: Create Input Fields for each type below
// TODO: Create custom styles for each type, check ticket for reference
// TODO: Input validation
function create_input({ question }: QuestionProp, handler: (event: ChangeEvent<HTMLInputElement>) => void): JSX.Element | JSX.Element[] {
    let result: JSX.Element | JSX.Element[];
    let options: Array<string> = question.data["options"];

    // Catch input types that require options but don't have any
    if (options === undefined && _require_options.includes(question.type)) {
        // TODO: Implement some sort of warning here
        options = [];
    }

    switch (question.type) {
        case QuestionType.Checkbox:
            result = options.map((option, index) => <InputTypes.Checkbox index={index} option={option} handler={handler} key={index}/>);
            break;

        case QuestionType.Radio:
            result = options.map((option, index) => <InputTypes.Radio option={option} name={question.name} handler={handler} key={index}/>);
            break;

        case QuestionType.ShortText:
            result = <InputTypes.ShortText handler={handler}/>;
            break;

        case QuestionType.Range:
            result = <InputTypes.Range options={options} handler={handler}/>;
            break;

        case QuestionType.Code:
        case QuestionType.Select:
        case QuestionType.Section:
        case QuestionType.TextArea:
        default:
            result = <InputTypes.ShortText handler={handler}/>;
    }

    return result;
}

class RenderedQuestion extends React.Component<QuestionProp> {
    constructor(props: QuestionProp) {
        super(props);
        this.handler = this.handler.bind(this);

        if (!_skip_normal_state.includes(props.question.type)) {
            this._setState("value", "");
        }
    }

    _setState(target: string, value: any, callback?:() => void): void {
        this.setState({[target]: value}, callback);
        this.props.public_state.set(target, value);
    }

    handler(event: ChangeEvent<HTMLInputElement>): void {
        const target = event.target;

        let value: string | boolean;
        switch (target.type) {
            case QuestionType.Checkbox:
                value = target.checked;
                break;

            case QuestionType.Radio:
                if (target.parentElement) {
                    value = target.parentElement.innerText.trimEnd();
                } else {
                    value = target.value;
                }
                break;

            default:
                value = target.value;
        }

        this._setState(target.name, value);

        // Toggle checkbox class
        if (target.type == "checkbox" && target.parentElement !== null) {
            target.parentElement.className = (value ? "" : "un") + "selected_checkbox_label checkbox_label unselectable";
        }
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

                case QuestionType.Radio:
                case QuestionType.Select:
                    this._setState(this.props.question.name, null)
                    break;
            }
        }
    }

    render() {
        const question = this.props.question;
        return <div>
            <h2 className="selectable">{question.name}</h2>
            {create_input(this.props, this.handler)}<br/><hr/>
        </div>
    }
}

export default RenderedQuestion;
