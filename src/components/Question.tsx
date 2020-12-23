/** @jsx jsx */
import { jsx } from "@emotion/react"
import React, { ChangeEvent } from "react";
import { Question, QuestionType } from "../api/question";

interface QuestionProp {
    question: Question,
}

class RenderedQuestion extends React.Component {
    constructor(props: QuestionProp) {
        super(props);

        this.handler = this.handler.bind(this);
    }

    handler(event: ChangeEvent<HTMLInputElement>): void {
        const target = event.target;
        const name: string = target.name;
        let value = target.type == "checkbox" ? target.checked : target.value;

        this.setState({
            [name]: value
        });

        event.preventDefault();
    }

    render() {
        const question = this.props.question;
        let question_input;

        const options: Array<string> = question.data["options"]

        switch (question.type) {
            // Direct Mappings
            case QuestionType.Radio:
                question_input = <input type={question.type} id={question.id}/>;
                break;

            case QuestionType.ShortText:
                question_input = <input type="text" id={question.id}/>;
                break;

            // Custom Logic
            case QuestionType.Checkbox:
                question_input = options.map((option, index) =>
                    <div key={index}>
                        <label>
                            <input type="checkbox" value={option} onChange={this.handler}/> {option}
                        </label><br/>
                    </div>
                )

                break;

            case QuestionType.Range:
                question_input = <input type="range" min={1} max={options.length} step={1}/>
                break;

            case QuestionType.TextArea:
            case QuestionType.Code:
            case QuestionType.Select:
                question_input = <input type="text" id={question.id}/>;
                break;

            // Not Input
            case QuestionType.Section:
            default:
                return <div/>;
        }

        return (
            <div>
                <label>{question.name}<br/>{question_input}</label>
            </div>
        )
    }
}

export default RenderedQuestion;
