/** @jsx jsx */
import { jsx } from "@emotion/react";
import JSX = jsx.JSX;

import React, { ChangeEvent } from "react";
import { Question, QuestionType } from "../api/question";

type QuestionProp = {
    question: Question,
    public_state: Map<string, any>;
}

// TODO: Create Input Fields for each type below
// TODO: Create custom styles for each type, check ticket for reference
function create_input({ question }: QuestionProp, handler: (event: ChangeEvent<HTMLInputElement>) => void): JSX.Element | JSX.Element[] {
    let result: JSX.Element | JSX.Element[];
    const options: Array<string> = question.data["options"]

    switch (question.type) {
        case QuestionType.Checkbox:
            result = options.map((option, index) =>
                <div key={index}>
                    <label>
                        <input type="checkbox" value={option} id={question.id + index}
                               name={`${option}`} onChange={handler}
                        />
                        {option}
                    </label><br/>
                </div>
            );

            break;

        case QuestionType.Radio:
            result = <input type="radio" id={question.id} name="0" onChange={handler}/>;
            break;

        case QuestionType.ShortText:
            result = <input type="text" id={question.id} name="0" onChange={handler}/>
            break;

        case QuestionType.Range:
            result = <input type="range" min={1} max={options.length} step={1} name="0"
                            id={question.id} onChange={handler}
            />

            break;

        case QuestionType.Code:
        case QuestionType.Select:
        case QuestionType.Section:
        case QuestionType.TextArea:
        default:
            result = <input type="text" id={question.id} name="0" onChange={handler}/>
    }

    return result;
}

class RenderedQuestion extends React.Component<QuestionProp> {
    constructor(props: QuestionProp) {
        super(props);
        this.handler = this.handler.bind(this);
    }

    handler(event: ChangeEvent<HTMLInputElement>): void {
        const target = event.target;
        const value = target.type == "checkbox" ? target.checked : target.value;

        this.setState({[target.name]: value});
        this.props.public_state.set(target.name, value);
    }

    render() {
        const question = this.props.question;
        return <label>{question.name}<br/>{create_input(this.props, this.handler)}<br/></label>
    }
}

export default RenderedQuestion;
