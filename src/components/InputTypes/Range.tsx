/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";
import colors from "../../colors";
import { hiddenInput, multiSelectInput } from "../../commonStyles";
import { useSelector } from "react-redux";
import { FormState } from "../../store/form/types";

interface RangeProps {
    question_id: string,
    options: Array<string>,
    handler: (event: ChangeEvent<HTMLInputElement>) => void,
    required: boolean,
    onBlurHandler: () => void
}

const containerStyles = css`
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;

  @media (max-width: 800px) {
    width: 20%;
    display: block;
    margin: 0 auto;
    
    label span {
      margin-left: 0;
      transform: translateY(1.6rem) translateX(2rem);
    }
  }
`;

const optionStyles = css`
  display: inline-block;
  transform: translateX(-50%);
  margin: 0 50%;

  white-space: nowrap;

  transition: transform 300ms;
`;

const selectorStyles = css`
  cursor: pointer;

  div {
    width: 1rem;
    height: 1rem;

    background-color: whitesmoke;

    border-radius: 50%;
    margin: 0 100% 0 0;
  }

  :hover div, :focus-within div {
    background-color: lightgray;
  }

  input:checked+div {
    background-color: ${colors.blurple};
  }
`;

const sliderContainerStyles = css`
  display: flex;
  justify-content: center;
  width: 100%;

  position: absolute;
  z-index: -1;

  top: 2.1rem;

  transition: all 300ms;
  
  @media (max-width: 800px) {
    width: 0.5rem;
    height: 80%;

    left: 0.4rem;

    background: whitesmoke;
  }
`;

const sliderStyles = css`
  width: 98%; /* Needs to be slightly smaller than container to work on all devices */
  height: 0.5rem;
  background-color: whitesmoke;

  transition: transform 300ms;
  
  @media (max-width: 800px) {
    display: none;
  }
`;

export default function Range(props: RangeProps): JSX.Element {
    const values = useSelector<FormState, FormState["values"]>(
        state => state.values
    );
    const value = values[props.question_id];
    const range = props.options.map((option, index) => {
        return (
            <label css={[selectorStyles, css`width: 1rem`]} key={index}>
                <span css={optionStyles}>{option}</span>
                <input type="radio" name={props.question_id} css={hiddenInput} onChange={props.handler} onBlur={props.onBlurHandler} checked={value === option}/>
                <div css={multiSelectInput}/>
            </label>
        );
    });

    return (
        <div css={containerStyles}>
            { range }

            <div css={sliderContainerStyles}>
                <div css={sliderStyles}/>
            </div>
        </div>
    );
}
