/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import colors from "../../colors";

interface RangeProps {
    question_id: string,
    options: Array<string>,
    state_dict: Map<string, string | boolean | null>
}

interface handler_props {
    state_dict: Map<string, string | boolean | null>,
    ref: React.RefObject<HTMLLabelElement>
}

let last_selection: Element;
function handler(this: handler_props): void {
    if (last_selection) {
        last_selection.classList.toggle("selected");
    }

    const dot: Element = this.ref.current!.lastElementChild!; // eslint-disable-line
    dot.classList.toggle("selected");

    last_selection = dot;

    const value: string = this.ref.current!.textContent!; //eslint-disable-line
    this.state_dict.set("value", value);
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

const rangeDotStyles = css`
  .range_dot {
    width: 0.8rem;
    height: 0.8rem;
    background-color: whitesmoke;

    border: 0.2rem solid whitesmoke;
    border-radius: 50%;

    transition: background-color 300ms;
  }

  .range_dot.selected {
    background-color: ${colors.blurple};
  }

  @media (max-width: 800px) {
    .range_dot {
      margin-bottom: 1.5rem;
    }
  }
`;

const sliderContainerStyles = css`
  display: flex;
  justify-content: center;
  width: 100%;

  position: absolute;
  z-index: -1;

  top: 2rem;

  transition: all 300ms;
  
  @media (max-width: 800px) {
    width: 0.5rem;
    height: 88%;

    left: 0.32rem;

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
    const range = props.options.map((option, index) => {
        const ref: React.RefObject<HTMLLabelElement> = React.createRef();
        return (
            <label key={index} ref={ref} css={css`width: 1rem;`} onClick={handler.bind({state_dict: props.state_dict, ref})}>
                <span css={optionStyles}>{option}</span>
                <div className="range_dot"/>
            </label>
        );
    });

    return (
        <div css={[containerStyles, rangeDotStyles]}>
            { range }

            <div css={sliderContainerStyles}>
                <div css={sliderStyles}/>
            </div>
        </div>
    );
}
