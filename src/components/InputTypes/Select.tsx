/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import { hiddenInput } from "../../commonStyles";

interface SelectProps {
    options: Array<string>,
    state_dict: Map<string, string | boolean | null>
}

const containerStyles = css`
  position: relative;
  width: min(20rem, 90%);

  color: black;
  cursor: pointer;

  :focus-within .selected_container {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const mainWindowStyles = css`
  display: inline-block;
  position: relative;
  background: whitesmoke;

  width: 100%;
  height: 100%;
  min-height: 2.5rem;

  margin-bottom: 0;

  overflow: hidden;
  z-index: 1;

  :hover, :focus-within {
    background-color: lightgray;
  }

  .selected_option {
    position: absolute;
    height: 100%;
    width: 100%;

    outline: none;
    text-align: center;
    line-height: 250%;
  }

  border: 0.1rem solid black;
  border-radius: 8px;

  transition: border-radius 400ms;
`;

const arrowStyles = css`
  .arrow {
    display: inline-block;
    height: 0.5rem;
    width: 0.5rem;

    position: relative;
    float: right;
    right: 1em;
    top: 0.7rem;

    border: solid black;
    border-width: 0 0.2rem 0.2rem 0;

    transform: rotate(45deg);
    transition: transform 400ms;
  }

  :focus-within .arrow {
    transform: translateY(40%) rotate(225deg);
  }
`;

const optionContainerStyles = css`
  .option_container {
    position: absolute;
    width: 100%;
    height: 0;
    
    top: 2.3rem;
    padding-top: 0.2rem;

    visibility: hidden;
    opacity: 0;

    overflow: hidden;
    background: whitesmoke;

    border: 0.1rem solid black;
    border-radius: 0 0 8px 8px;
    border-top: none;
    
    * {
      cursor: pointer;
    }
  }

  :focus-within .option_container, .active .option_container {
    height: auto;
    visibility: visible;
    opacity: 1;
  }
  
  .option_container .hidden {
    display: none;
  }
`;

const inputStyles = css`
  position: absolute;
  width: 100%;
  height: 100%;

  z-index: 2;

  margin: 0;
  border: none;
  outline: none;
`;

const optionStyles = css`
  position: relative;
  
  :hover, :focus-within {
    background-color: lightgray;
  }
  
  div {
    padding: 0.75rem;
    text-align: center;
  }
`;

function handleFocus(container: React.RefObject<HTMLDivElement>, event: React.FocusEvent<HTMLDivElement>) {
    if (!container.current) {
        return;
    }

    if (event.type == "focus") {
        container.current.classList.add("active");
    } else if (event.type == "blur") {
        container.current.classList.remove("active");
    }
}

class Select extends React.Component<SelectProps> {
    handler(selected_option: React.RefObject<HTMLDivElement>, event: React.ChangeEvent<HTMLInputElement>): void {
        const option_container = event.target.parentElement;
        if (!option_container || !option_container.parentElement || !selected_option.current) {
            return;
        }

        const all_options: Element = option_container.parentElement;

        // Update stored value
        this.props.state_dict.set("value", option_container.textContent);

        // Show all elements
        Array.from(all_options.children).forEach(child => child.classList.remove("hidden"));

        // Hide selected element, and display new element as selected
        option_container.classList.add("hidden");
        selected_option.current.textContent = option_container.textContent;
    }

    render(): JSX.Element {
        const container_ref: React.RefObject<HTMLDivElement> = React.createRef();
        const selected_option_ref: React.RefObject<HTMLDivElement> = React.createRef();

        return (
            <div css={[containerStyles, arrowStyles, optionContainerStyles]} ref={container_ref}>
                <div className="selected_container" css={mainWindowStyles}>
                    <span className="arrow"/>
                    <div tabIndex={0} className="selected_option" ref={selected_option_ref} onFocus={event => handleFocus(container_ref, event)} onBlur={event => handleFocus(container_ref, event)}>...</div>
                </div>

                <div className="option_container">
                    { this.props.options.map((option, index) => (
                        <div key={index} css={optionStyles}>
                            <hr css={css`margin: 0 1rem;`}/>
                            <input type="checkbox" css={[hiddenInput, inputStyles]} onChange={event => this.handler.call(this, selected_option_ref, event)} onFocus={event => handleFocus(container_ref, event)} onBlur={event => handleFocus(container_ref, event)}/>
                            <div>{option}</div>
                        </div>
                    )) }
                </div>
            </div>
        );
    }
}

export default Select;
