/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";
import colors from "../../colors";

interface CheckboxProps {
    index: number,
    option: string,
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

const generalStyles = css`
  label {
    display: inline-block;
    position: relative;
    top: 0.25em;

    width: 1em;
    height: 1em;

    margin: 1rem 0.5rem 0 0;
    border: whitesmoke 0.2rem solid;
    border-radius: 25%;
    
    transition: background-color 300ms;
  }

  .unselected {
    background-color: white;
  }

  .unselected:hover {
    background-color: lightgray;
  }

  input {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
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
    return (
        <label css={[generalStyles, activeStyles]}>
            <label className="unselected">
                <input type="checkbox" value={props.option}
                    name={`${("000" + props.index).slice(-4)}. ${props.option}`} onChange={props.handler}/>
                <span className="checkmark"/>
            </label>
            {props.option}<br/>
        </label>
    );
}
