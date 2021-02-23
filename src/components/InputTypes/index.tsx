import Checkbox from "./Checkbox";
import Code from "./Code";
import Radio from "./Radio";
import Range from "./Range";
import Select from "./Select";
import ShortText from "./ShortText";
import TextArea from "./TextArea";

import React, {ChangeEvent} from "react";

import {QuestionType} from "../../api/question";
import {QuestionDispatchProp, QuestionProp, QuestionStateProp} from "../Question";

const require_options: Array<QuestionType> = [
    QuestionType.Radio,
    QuestionType.Checkbox,
    QuestionType.Select,
    QuestionType.Range
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function create_input(props: QuestionProp & QuestionStateProp & QuestionDispatchProp, handler: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, onBlurHandler: () => void, focus_ref: React.RefObject<any>): JSX.Element | JSX.Element[] {
    let result: JSX.Element | JSX.Element[];
    const question = props.question;

    // eslint-disable-next-line
    // @ts-ignore
    let options: string[] = question.data["options"];
    const valid = props.valid[question.id];

    // Catch input types that require options but don't have any
    if ((options === undefined || typeof options !== "object") && require_options.includes(question.type)) {
        // TODO: Implement some sort of warning here
        options = [];
    }

    /* eslint-disable react/react-in-jsx-scope */
    switch (question.type) {
        case QuestionType.TextArea:
            result = <TextArea question={question} handler={handler} valid={valid} onBlurHandler={onBlurHandler} focus_ref={focus_ref}/>;
            break;

        case QuestionType.Checkbox:
            result = options.map((option, index) => <Checkbox question={question} index={index} option={option} handler={handler} key={index}/>);
            break;

        case QuestionType.Radio:
            result = options.map((option, index) => <Radio option={option} question_id={question.id} handler={handler} key={index} onBlurHandler={onBlurHandler}/>);
            break;

        case QuestionType.Select:
            result = <Select options={options} question={question} valid={valid} onBlurHandler={onBlurHandler}/>;
            break;

        case QuestionType.ShortText:
            result = <ShortText key={props.question.id} handler={handler} onBlurHandler={onBlurHandler} valid={valid} focus_ref={focus_ref} question={question}/>;
            break;

        case QuestionType.Range:
            result = <Range question_id={question.id} options={options} handler={handler} required={question.required} onBlurHandler={onBlurHandler}/>;
            break;

        case QuestionType.Code:
            // TODO: Implement
            result = <Code handler={handler}/>;
            break;

        default:
            result = <TextArea question={question} handler={handler} valid={valid} onBlurHandler={onBlurHandler} focus_ref={focus_ref}/>;
    }
    /* eslint-enable react/react-in-jsx-scope */

    return result;
}
