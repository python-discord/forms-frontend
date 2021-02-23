/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import { connect } from "react-redux";

import { hiddenInput, invalidStyles } from "../../commonStyles";
import { Question } from "../../api/question";
import { setValue, SetValueAction } from "../../store/form/actions";
import { FormState } from "../../store/form/types";

interface SelectProps {
    options: Array<string>,
    valid: boolean,
    onBlurHandler: () => void,
    question: Question
}

interface SelectStateProps {
    values: { [key: string]: string | { [subKey: string]: boolean; } | null; }
}

interface SelectDispatchProps {
    setValue: (question: Question, value: string | { [key: string]: boolean } | null) => SetValueAction
}

const containerStyles = css`
  position: relative;
  width: min(20rem, 90%);

  color: black;
  cursor: pointer;

  :focus-within .selected_container {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    border-bottom-color: transparent;
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
    padding-left: 0.75rem;
    line-height: 250%;
  }

  border: 0.1rem solid black;
  border-radius: 8px;

  transition: border-radius 200ms;
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
    transition: transform 200ms;
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

    transition: opacity 200ms, visibility 200ms;

    * {
      cursor: pointer;
    }
  }

  :focus-within .option_container {
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
  }
`;

class Select extends React.Component<SelectProps & SelectStateProps & SelectDispatchProps> {
    handler(selected_option: React.RefObject<HTMLDivElement>, event: React.ChangeEvent<HTMLInputElement>): void {
        const option_container = event.target.parentElement;
        if (!option_container || !option_container.parentElement || !selected_option.current) {
            return;
        }

        // Update stored value
        this.props.setValue(this.props.question, option_container.textContent);

        // Close the menu
        selected_option.current.focus();
        selected_option.current.blur();
        selected_option.current.textContent = option_container.textContent;
    }

    handle_click(
        container: React.RefObject<HTMLDivElement>,
        selected_option: React.RefObject<HTMLDivElement>,
        event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ): void {
        if (!container.current || !selected_option.current || (event.type === "keydown" && (event as React.KeyboardEvent).code !== "Space")) {
            return;
        }

        // Check if menu is open
        if (container.current.contains(document.activeElement)) {
            // Close menu
            selected_option.current.focus();
            selected_option.current.blur();
            event.preventDefault();
        }
    }

    focusOption(): void {
        if (!(this.props.question.id in this.props.values) || !this.props.values[this.props.question.id]) {
            this.props.setValue(this.props.question, "temporary");
            this.props.onBlurHandler();
            this.props.setValue(this.props.question, null);
        }
    }

    render(): JSX.Element {
        const container_ref: React.RefObject<HTMLDivElement> = React.createRef();
        const selected_option_ref: React.RefObject<HTMLDivElement> = React.createRef();

        const handle_click = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => this.handle_click(container_ref, selected_option_ref, event);

        return (
            <div css={[containerStyles, arrowStyles, optionContainerStyles, invalidStyles]} onFocus={this.focusOption.bind(this)} ref={container_ref} onBlur={this.props.onBlurHandler}>
                <div css={mainWindowStyles} className={!this.props.valid ? "invalid-box selected_container" : "selected_container"}>
                    <span className="arrow"/>
                    <div tabIndex={0} className="selected_option" ref={selected_option_ref} onMouseDown={handle_click} onKeyDown={handle_click}>...</div>
                </div>

                <div className="option_container" tabIndex={-1} css={css`outline: none;`}>
                    { this.props.options.map((option, index) => (
                        <div key={index} css={optionStyles}>
                            <input type="checkbox" css={[hiddenInput, inputStyles]} onChange={event => this.handler.call(this, selected_option_ref, event)}/>
                            <div>{option}</div>
                        </div>
                    )) }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: FormState, ownProps: SelectProps): SelectProps & SelectStateProps => {
    return {
        ...ownProps,
        values: state.values
    };
};

const mapDispatchToProps = {
    setValue
};

export default connect(mapStateToProps, mapDispatchToProps)(Select);
