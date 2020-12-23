/** @jsx jsx */
import { jsx } from "@emotion/react";
import JSX = jsx.JSX;

import React, { ChangeEvent } from "react";
import { Question, QuestionType } from "../api/question";

type QuestionProp = {
    question: Question,
    public_state: Map<string, any>,
}

// TODO: Create Input Fields for each type below
// TODO: Create custom styles for each type, check ticket for reference
// TODO: Input validation
function create_input({ question }: QuestionProp, handler: (event: ChangeEvent<HTMLInputElement>) => void): JSX.Element | JSX.Element[] {
    let result: JSX.Element | JSX.Element[];
    const options: Array<string> = question.data["options"]

    switch (question.type) {
        case QuestionType.Checkbox:
            result = options.map((option, index) =>
                <label className="checkbox_label selectable" key={index}>
                    <label id="unselected_checkbox_label" className="unselectable checkbox_direct">
                        <input type="checkbox" value={option} className="regular_checkbox"
                               name={`${("000" + index).slice(-4)}. ${option}`} onChange={handler}
                        />
                    </label>  {option}<br/>
                </label>
            );

            break;

        case QuestionType.RoundCheckbox:
            result = options.map((option, index) =>
                <label id="unselected_round_checkbox_label" className="round_checkbox_label" key={index}>
                    <input type="checkbox" value={option} className="round_checkbox"
                           name={`${("000" + index).slice(-4)}. ${option}`} onChange={handler}
                    />
                    {option}
                </label>
            );

            break;

        case QuestionType.Radio:
            result = <input type="radio" id="radio" name="value" onChange={handler}/>;
            break;

        case QuestionType.ShortText:
            result = <input type="text" id="text" name="value" onChange={handler}/>
            break;

        case QuestionType.Range:
            result = <input type="range" min={1} max={options.length} step={1} name="value" id="range" onChange={handler}/>
            break;

        case QuestionType.Code:
        case QuestionType.Select:
        case QuestionType.Section:
        case QuestionType.TextArea:
        default:
            result = <input type="text" id="text" name="value" onChange={handler}/>
    }

    return result;
}

class RenderedQuestion extends React.Component<QuestionProp> {
    constructor(props: QuestionProp) {
        super(props);
        this.handler = this.handler.bind(this);

        if (props.question.type !== QuestionType.Checkbox) {
            this.setState({["value"]: ""});
            this.props.public_state.set("value", "");
        }
    }

    _setState(target: string, value: any, callback?:() => void): void {
        this.setState({[target]: value}, callback);
        this.props.public_state.set(target, value);
    }

    handler(event: ChangeEvent<HTMLInputElement>): void {
        const target = event.target;
        const value = target.type == "checkbox" ? target.checked : target.value;

        this._setState(target.name, value);

        // Toggle checkbox ID
        if (target.type == "checkbox" && target.parentElement !== null) {
            if (target.className.endsWith("round_checkbox")) {
                target.parentElement.id = (value ? "" : "un") + "selected_round_checkbox_label";
            } else {
                target.parentElement.id = (value ? "" : "un") + "selected_checkbox_label";
            }
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
