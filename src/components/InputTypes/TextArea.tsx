/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent, FocusEvent } from "react";
import { invalidStyles, textInputs } from "../../commonStyles";

interface TextAreaProps {
    handler: (event: ChangeEvent<HTMLTextAreaElement>) => void,
    onBlurHandler: (event: FocusEvent<HTMLTextAreaElement>) => void,
    valid: boolean
}

const styles = css`
  min-height: 20rem;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;

  padding: 1rem;
`;

export default function TextArea(props: TextAreaProps): JSX.Element {
    return (
        <div css={invalidStyles}>
            <textarea css={[textInputs, styles]} placeholder="Enter Text..." onChange={props.handler} onBlur={props.onBlurHandler} className={!props.valid ? "invalid-box" : ""}/>
        </div>
    );
}
