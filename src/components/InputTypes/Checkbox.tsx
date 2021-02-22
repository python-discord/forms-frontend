/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";
import colors from "../../colors";
import { multiSelectInput, hiddenInput } from "../../commonStyles";
import {useSelector} from "react-redux";
import {FormState} from "../../store/form/types";

interface CheckboxProps {
    index: number,
    option: string,
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

const generalStyles = css`
  cursor: pointer;
        
  label {
    width: 1em;
    height: 1em;
    top: 0.3rem;

    border-radius: 25%;
    cursor: pointer;
  }

  .unselected {
    background-color: white;
  }

  .unselected:focus-within, :hover .unselected {
    background-color: lightgray;
  }

  .checkmark {
    position: absolute;
  }
`;

const activeStyles = css`
  .selected {
    background-color: ${colors.blurple};
  }

  .selected .checkmark {
    width: 0.30rem;
    height: 0.60rem;
    left: 0.25em;

    border: solid white;
    border-width: 0 0.2rem 0.2rem 0;

    transform: rotate(45deg);
  }
`;

export default function Checkbox(props: CheckboxProps): JSX.Element {
    const values = useSelector<FormState, FormState["values"]>(
        state => state.values
    );
    return (
        <label css={[generalStyles, activeStyles]}>
            <label className="unselected" css={multiSelectInput}>
                <input type="checkbox" value={props.option} css={hiddenInput} name={`${("000" + props.index).slice(-4)}. ${props.option}`} onChange={props.handler} checked={!!values[`${("000" + props.index).slice(-4)}. ${props.option}`]}/>
                <span className="checkmark"/>
            </label>
            {props.option}<br/>
        </label>
    );
}
