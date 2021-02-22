/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";

import { textInputs, invalidStyles } from "../../commonStyles";
import { Question } from "../../api/question";
import { FormState } from "../../store/form/types";

interface ShortTextProps {
    handler: (event: ChangeEvent<HTMLInputElement>) => void,
    onBlurHandler: () => void,
    valid: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    focus_ref: React.RefObject<any>,
    question: Question
}

export default function ShortText(props: ShortTextProps): JSX.Element {
    const values = useSelector<FormState, FormState["values"]>(
        state => state.values
    );
    const value = values[props.question.id];

    return (
        <div css={invalidStyles}>
            <input type="text" value={typeof value === "string" ? value : ""} css={textInputs} placeholder="Enter Text..." onChange={props.handler} onBlur={props.onBlurHandler} className={!props.valid ? "invalid-box" : ""} ref={props.focus_ref}/>
        </div>
    );
}
