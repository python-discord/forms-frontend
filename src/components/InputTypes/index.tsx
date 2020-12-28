import Checkbox from "./Checkbox"
import Code from "./Code"
import Radio from "./Radio"
import Range from "./Range"
import Select from "./Select"
import ShortText from "./ShortText";
import TextArea from "./TextArea";

import React, { ChangeEvent } from "react";

import { QuestionType } from "../../api/question";
import { QuestionProp } from "../Question"

const _require_options: Array<QuestionType> = [
    QuestionType.Radio,
    QuestionType.Checkbox,
    QuestionType.Select
];

export default function create_input({ question, public_state }: QuestionProp, handler: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void): JSX.Element | JSX.Element[] {
    let result: JSX.Element | JSX.Element[];
    let options: Array<string> = question.data["options"];

    // Catch input types that require options but don't have any
    if (options === undefined && _require_options.includes(question.type)) {
        // TODO: Implement some sort of warning here
        options = [];
    }

    switch (question.type) {
        case QuestionType.TextArea:
            result = <TextArea handler={handler}/>;
            break;

        case QuestionType.Checkbox:
            result = options.map((option, index) => <Checkbox index={index} option={option} handler={handler} key={index}/>);
            break;

        case QuestionType.Radio:
            result = options.map((option, index) => <Radio option={option} name={question.id} handler={handler} key={index}/>);
            break;

        case QuestionType.Select:
            result = <Select options={options} state_dict={public_state}/>
            break;

        case QuestionType.ShortText:
            result = <ShortText handler={handler}/>;
            break;

        case QuestionType.Range:
            result = <Range options={options} handler={handler}/>;
            break;

        case QuestionType.Code:
            // TODO: Implement

        default:
            result = <TextArea handler={handler}/>;
    }

    return result;
}
