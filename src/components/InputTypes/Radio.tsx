/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";
import colors from "../../colors";
import { multiSelectInput } from "../../commonStyles";

interface RadioProps {
    option: string,
    question_id: string,
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

const styles = css`
  input {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
  }
  
  div {
    width: 0.5em;
    height: 0.5em;
    top: 0.1rem;

    border-radius: 50%;
  }

  :hover div {
    background-color: lightgray;
  }

  input:checked+div {
    background-color: ${colors.blurple};
  }
`;

export default function Radio(props: RadioProps): JSX.Element {
    return (
        <label css={styles}>
            <input type="radio" name={props.question_id} onChange={props.handler}/>
            <div css={multiSelectInput}/>
            {props.option}<br/>
        </label>
    );
}
