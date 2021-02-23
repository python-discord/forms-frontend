/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";
import { invalidStyles, textInputs } from "../../commonStyles";
import { useSelector } from "react-redux";
import { FormState } from "../../store/form/types";
import { Question } from "../../api/question";

interface TextAreaProps {
    handler: (event: ChangeEvent<HTMLTextAreaElement>) => void,
    onBlurHandler: () => void,
    valid: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    focus_ref: React.RefObject<any>,
    question: Question
}

const styles = css`
  min-height: 20rem;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;

  padding: 1rem;
`;

export default function TextArea(props: TextAreaProps): JSX.Element {
    const values = useSelector<FormState, FormState["values"]>(
        state => state.values
    );
    const value = values[props.question.id];
    return (
        <div css={invalidStyles}>
            <textarea css={[textInputs, styles]} value={typeof value === "string" ? value : ""} placeholder="Enter Text..." onChange={props.handler} onBlur={props.onBlurHandler} className={!props.valid ? "invalid-box" : ""} ref={props.focus_ref}/>
        </div>
    );
}
