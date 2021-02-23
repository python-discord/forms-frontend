/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";
import colors from "../../colors";
import { multiSelectInput, hiddenInput } from "../../commonStyles";
import { useSelector } from "react-redux";
import { FormState } from "../../store/form/types";

interface RadioProps {
    option: string,
    question_id: string,
    handler: (event: ChangeEvent<HTMLInputElement>) => void,
    onBlurHandler: () => void
}

const styles = css`
  div {
    width: 0.7em;
    height: 0.75em;
    top: 0.18rem;

    border-radius: 50%;
  }

  :hover div, :focus-within div {
    background-color: lightgray;
  }

  input:checked+div {
    background-color: ${colors.blurple};
  }
`;

export default function Radio(props: RadioProps): JSX.Element {
    const values = useSelector<FormState, FormState["values"]>(
        state => state.values
    );
    const value = values[props.question_id];
    return (
        <label css={styles}>
            <input type="radio" name={props.question_id} onChange={props.handler} css={hiddenInput} onBlur={props.onBlurHandler} checked={value === props.option}/>
            <div css={multiSelectInput}/>
            {props.option}<br/>
        </label>
    );
}
