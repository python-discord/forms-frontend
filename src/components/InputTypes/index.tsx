import Checkbox from "./Checkbox";
import Radio from "./Radio";
import Range from "./Range";
import Select from "./Select";
import ShortText from "./ShortText";
import TextArea from "./TextArea";

import React, { ChangeEvent } from "react";

import { QuestionType } from "../../api/question";
import { QuestionProp } from "../Question";
import Code from "./Code";

const require_options: Array<QuestionType> = [
    QuestionType.Radio,
    QuestionType.Checkbox,
    QuestionType.Select,
    QuestionType.Range
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function create_input({ question, public_state }: QuestionProp, handler: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => void, onBlurHandler: () => void, focus_ref: React.RefObject<any>): JSX.Element | JSX.Element[] {
    let result: JSX.Element | JSX.Element[];

    // eslint-disable-next-line
    // @ts-ignore
    let options: string[] = question.data["options"];
    let valid = true;
    if (!public_state.get("valid")) {
        valid = false;
    }

    // Catch input types that require options but don't have any
    if ((options === undefined || typeof options !== "object") && require_options.includes(question.type)) {
        // TODO: Implement some sort of warning here
        options = [];
    }

    /* eslint-disable react/react-in-jsx-scope */
    switch (question.type) {
        case QuestionType.Code:
            result = <Code handler={handler} questionId={question.id}/>;
            break;

        case QuestionType.TextArea:
            result = <TextArea handler={handler} valid={valid} onBlurHandler={onBlurHandler} focus_ref={focus_ref}/>;
            break;

        case QuestionType.Checkbox:
            result = options.map((option, index) => <Checkbox index={index} option={option} handler={handler} key={index}/>);
            break;

        case QuestionType.Radio:
            result = options.map((option, index) => <Radio option={option} question_id={question.id} handler={handler} key={index} onBlurHandler={onBlurHandler}/>);
            break;

        case QuestionType.Select:
            result = <Select options={options} state_dict={public_state} valid={valid} onBlurHandler={onBlurHandler}/>;
            break;

        case QuestionType.ShortText:
            result = <ShortText handler={handler} onBlurHandler={onBlurHandler} valid={valid} focus_ref={focus_ref}/>;
            break;

        case QuestionType.Range:
            result = <Range question_id={question.id} options={options} handler={handler} required={question.required} onBlurHandler={onBlurHandler}/>;
            break;

        default:
            result = <TextArea handler={handler} valid={valid} onBlurHandler={onBlurHandler} focus_ref={focus_ref}/>;
    }
    /* eslint-enable react/react-in-jsx-scope */

    return result;
}
