/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

interface SelectProps {
    options: Array<string>,
    state_dict: Map<string, string | boolean | null>
}

interface HandlerProps {
    props: SelectProps,
    ref: React.RefObject<HTMLDivElement>
}

const containerStyles = css`
  .container {
    display: inline-block;
    position: relative;

    width: min(20rem, 90%);
    height: 100%;
    min-height: 2rem;

    background: whitesmoke;

    color: black;
    text-align: center;

    margin-bottom: 0;

    border: 0.1rem solid black;
    border-radius: 8px;

    transition: border-radius 400ms;
  }

  .container.active {
    height: auto;
    border-radius: 8px 8px 0 0;
  }
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

  .active .arrow {
    transform: translateY(40%) rotate(225deg);
  }
`;

const optionContainer = css`
  .option_container {
    display: block;
    position: absolute;
    width: 100%;

    /* Need to account for margin */
    left: -0.1rem;

    visibility: hidden;
    opacity: 0;

    background: whitesmoke;
    overflow: hidden;

    border: 0.1rem solid black;
    border-radius: 0 0 8px 8px;
    border-top: none;

    transition: opacity 400ms, visibility 400ms;
  }

  .active .option_container {
    visibility: visible;
    opacity: 1;
  }
`;

class Select extends React.Component<SelectProps> {
    click_handler(this: HandlerProps, event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        if (!this.ref.current) {
            return;
        }

        this.ref.current.classList.toggle("active");

        const target: Element = (event.target as Element);
        if (target.id === "option") {
            const selected_option: Element = this.ref.current.getElementsByClassName("selected_option")[0];
            const new_option_text: string = target.textContent ?? "...";

            if (selected_option.textContent === "..." && target.parentElement) {
                target.parentElement.remove();
            } else {
                target.textContent = selected_option.textContent;
            }

            selected_option.textContent = new_option_text;
            this.props.state_dict.set("value", selected_option.textContent);
        }
    }

    render(): JSX.Element {
        const container_ref: React.RefObject<HTMLDivElement> = React.createRef();

        const element: JSX.Element = (
            <div className="container" ref={container_ref} onClick={this.click_handler.bind({ref: container_ref, props: this.props})}>
                <span className="arrow"/>
                <span className="selected_option" css={css`display: block; padding: 0.5rem 0;`}>...</span>

                <div className="option_container">
                    { this.props.options.map((option, index) => (
                        <div css={css`:hover { background-color: lightgray; }`} key={index}>
                            <hr css={css`margin: 0 1rem;`}/>
                            <div id="option" css={css`padding: 0.75rem;`}>{option}</div>
                        </div>
                    )) }
                </div>
            </div>
        );

        return <div css={[containerStyles, arrowStyles, optionContainer]}>{ element }</div>;
    }
}

export default Select;
