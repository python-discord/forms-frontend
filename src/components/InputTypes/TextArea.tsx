/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";
import { textInputs } from "../../commonStyles";
import ErrorMessage from "../ErrorMessage";
import colors from "../../colors";

interface TextAreaProps {
    handler: (event: ChangeEvent<HTMLTextAreaElement>) => void,
    required: boolean,
    valid: boolean,
    error: string
}

const styles = css`
  min-height: 20rem;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;

  padding: 1rem;
`;

const invalidStyles = css`
  .invalid-box {
    box-shadow: 0 0 10px ${colors.error};
    border: none;
  }
`;

export default function TextArea(props: TextAreaProps): JSX.Element {
    return (
        <div css={invalidStyles}>
            <textarea css={[textInputs, styles]} placeholder="Enter Text..." onChange={props.handler} className={!props.valid ? "invalid-box" : ""} required={props.required}/>
            <ErrorMessage show={!props.valid} message={props.error}/>
        </div>
    );
}
