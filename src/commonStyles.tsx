import { css } from "@emotion/react";
import colors from "./colors";

const selectable = css`
  -moz-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text;
`;

const unselectable = css`
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const hiddenInput = css`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

const multiSelectInput = css`
  display: inline-block;
  position: relative;

  margin: 1rem 0.5rem 0 0;
  border: whitesmoke 0.2rem solid;

  background-color: whitesmoke;
  transition: background-color 200ms;
`;

const textInputs = css`
  display: inline-block;
  width: min(20rem, 90%);
  height: 100%;
  min-height: 2rem;

  background: whitesmoke;

  color: black;
  padding: 0.15rem 1rem 0 1rem;
  font: inherit;

  margin-bottom: 0;

  border: 0.1rem solid black;
  border-radius: 8px;
`;

const submitStyles = css`
  text-align: right;
  white-space: nowrap;

  button:disabled {
    background-color: ${colors.greyple};
    cursor: default;
  }

  button {
    cursor: pointer;

    border: none;
    border-radius: 8px;

    color: white;
    font: inherit;

    background-color: ${colors.blurple};
    transition: background-color 300ms;
  }
  
  button[type="submit"] {
    padding: 0.55rem 4.25rem;
  }

  button:enabled:hover {
    background-color: ${colors.darkerBlurple};
  }
`;

const invalidStyles = css`
  .invalid-box {
    -webkit-appearance: none;
    -webkit-box-shadow: 0 0 0.6rem ${colors.error};
    box-shadow: 0 0 0.6rem ${colors.error};
    border-color: transparent;
  }
`;

export {
    selectable,
    unselectable,
    hiddenInput,
    multiSelectInput,
    textInputs,
    submitStyles,
    invalidStyles
};
