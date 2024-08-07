/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx, css } from "@emotion/react";
import React, { MutableRefObject, useEffect, useRef } from "react";

import { hiddenInput, invalidStyles } from "../../commonStyles";
import RenderedQuestion from "../Question";

// This should be mostly exhaustive, but it's not guaranteed to be.
const TIMEZONE_OFFSETS = [
    "-12:00",
    "-11:00",
    "-10:00",
    "-09:30",
    "-09:00",
    "-08:00",
    "-07:00",
    "-06:00",
    "-05:00",
    "-04:00",
    "-03:30",
    "-03:00",
    "-02:00",
    "-01:00",
    "+00:00",
    "+01:00",
    "+02:00",
    "+03:00",
    "+03:30",
    "+04:00",
    "+04:30",
    "+05:00",
    "+05:30",
    "+05:45",
    "+06:00",
    "+06:30",
    "+07:00",
    "+08:00",
    "+08:45",
    "+09:00",
    "+09:30",
    "+10:00",
    "+10:30",
    "+11:00",
    "+12:00",
    "+12:45",
    "+13:00",
    "+14:00"
];

const offsetToText = (offset: number) => {
    const hours = Math.floor(offset);
    const minutes = (offset - hours) * 60;

    return `${hours < 0 ? "-" : "+"}${String(Math.abs(hours)).padStart(2, "0")}:${String(Math.abs(minutes)).padStart(2, "0")}`;
};

interface TimeZoneProps {
    valid: boolean,
    question: React.RefObject<RenderedQuestion>
    onBlurHandler: () => void
}

const containerStyles = css`
  display: flex;
  position: relative;
  width: min(20rem, 90%);
  
  flex-direction: column;
  border-bottom: 0;

  color: black;
  cursor: pointer;

  :focus-within .selected_container {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    border-bottom-color: transparent;
  }
`;

const copyStyles = css`
  color: white;
  margin-bottom: 15px;
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
    outline: none;

    transition: opacity 200ms, visibility 200ms;

    * {
      cursor: pointer;
    }
    
    .scrollbar-container {
      height: 150px;
      overflow-y: scroll;
    }
  }

  :focus-within .option_container {
    height: 100%;
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

const getTZ = () => {
    const distanceFromUTC = -(new Date().getTimezoneOffset() / 60);
    const guessedTimeZoneOffset = offsetToText(distanceFromUTC);
    const recognisedZone = TIMEZONE_OFFSETS.indexOf(guessedTimeZoneOffset) !== -1;

    return recognisedZone ? guessedTimeZoneOffset : false;
};

const TimeZone: React.FC<TimeZoneProps> = ({ question, valid, onBlurHandler }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedOptionRef = useRef<HTMLDivElement>(null);

    const handler = (selectedOption: MutableRefObject<HTMLDivElement | null>, event: React.ChangeEvent<HTMLInputElement>) => {
        const optionContainer = event.target.parentElement;
        if (!optionContainer || !optionContainer.parentElement || !selectedOption.current) {
            return;
        }

        if (!question?.current) {
            throw new Error("Missing ref for select question.");
        }

        // Update stored value
        question.current.setState({ value: optionContainer.textContent });

        // Close the menu
        selectedOption.current.focus();
        selectedOption.current.blur();
        selectedOption.current.textContent = optionContainer.textContent;
    };

    const handleClick = (container: MutableRefObject<HTMLDivElement | null>, selectedOption: MutableRefObject<HTMLDivElement | null>, event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
        if (!container.current || !selectedOption.current) {
            return;
        }

        // if it is a keyboard event and it is not the space key, return
        if (event.type === "keydown" && (event as React.KeyboardEvent).code !== "Space") {
            return;
        }

        // Check if menu is open
        if (container.current.contains(document.activeElement)) {
            // Close menu
            selectedOption.current.focus();
            selectedOption.current.blur();
            event.preventDefault();
        }
    };

    const focusOption = () => {
        if (!question?.current) {
            throw new Error("Missing ref for select question.");
        }

        if (!question.current.realState.value) {
            question.current.setState({ value: "temporary" });
            onBlurHandler();
            question.current.setState({ value: null });
        }
    };

    useEffect(() => {
        const tz = getTZ();

        if (tz) {
            if (!question.current) {
                console.warn("No ref to question component in TimeZone.");
            } else {
                question.current.setState({ value: tz });
            }
        }
    }, [question]);

    const tz = getTZ();

    const FOUND_COPY = "We have tried to guess your timezone based on your system settings. If this is incorrect, please select the correct timezone from the list below.";
    const NOT_FOUND_COPY = "We could not automatically detect your timezone. Please select it from the list below.";

    return (
        <>
            <div css={copyStyles}>
                <p>{tz ? FOUND_COPY : NOT_FOUND_COPY}</p>

                <p>Timezones are displayed as offsets from UTC. For example, UTC+1 is one hour ahead of UTC, and UTC-5 is five hours behind UTC.</p>
            </div>
            <div
                css={[containerStyles, arrowStyles, optionContainerStyles, invalidStyles]}
                onFocus={focusOption}
                ref={containerRef}
                onBlur={onBlurHandler}
            >
                <div
                    css={mainWindowStyles}
                    className={!valid ? "invalid-box selected_container" : "selected_container"}
                >
                    <span className="arrow" />
                    <div
                        tabIndex={0}
                        className="selected_option"
                        ref={selectedOptionRef}
                        onMouseDown={(event) => handleClick(containerRef, selectedOptionRef, event)}
                        onKeyDown={(event) => handleClick(containerRef, selectedOptionRef, event)}
                    >
                        {tz ? tz : "..."}
                    </div>
                </div>

                <div className="option_container" tabIndex={-1}>
                    <div className="scrollbar-container">
                        {TIMEZONE_OFFSETS.map((option, index) => (
                            <div key={index} css={optionStyles}>
                                <input
                                    type="checkbox"
                                    css={[hiddenInput, inputStyles]}
                                    onChange={(event) => handler(selectedOptionRef, event)}
                                />
                                <div>{option}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TimeZone;
