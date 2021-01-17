/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";
import { textInputs } from "../../commonStyles";

interface TextAreaProps {
    handler: (event: ChangeEvent<HTMLTextAreaElement>) => void,
    required: boolean
}

const styles = css`
  min-height: 20rem;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;

  padding: 1rem;
`;

export default function TextArea(props: TextAreaProps): JSX.Element {
    return <textarea css={[textInputs, styles]} placeholder="Enter Text..." onChange={props.handler}/>;
}
