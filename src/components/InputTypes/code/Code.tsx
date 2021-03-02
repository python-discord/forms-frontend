/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";

import prismStyles from "./prism_css";
import Prism from 'prismjs';

/**
 * For supported languages, and language codes, see:
 * https://prismjs.com/#supported-languages
 */
interface CodeProps {
    handler: (event: ChangeEvent<HTMLInputElement>) => void,
    language: string,
}

const blockStyles = css`
  pre[class*="language-"] {
    min-height: 20rem;
    height: 100%;
    width: 100%;
    box-sizing: border-box;

    resize: vertical;
    padding: 1rem;
    background: whitesmoke;

    color: black;
    font-family: Hind, Helvetica, Arial, sans-serif;

    margin: auto;

    border: 0.1rem solid black;
    border-radius: 8px;
    font-size: 1rem;
  }
`;

const textareaStyles = css`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  resize: none;

  font-family: Hind, Helvetica, Arial, sans-serif;
  padding: 1rem;
  box-sizing: border-box;
  font-size: 1rem;
  border: 0.1rem solid transparent;
  border-radius: 8px;
`;

export default class Code extends React.Component<CodeProps> {
    constructor(props: CodeProps) {
        super(props);
    }

    render() {
        const ref: React.RefObject<HTMLInputElement> = React.createRef();
        const placeholder = "print(\"hello world\")"

        return <div css={[prismStyles, blockStyles, css`position: relative;`]}>
            <pre className="language-js">
                <code className="language-js" ref={ref}>{placeholder}</code>
            </pre>
            <textarea css={textareaStyles} onChange={event => {
                ref.current!.textContent = event.target.value || placeholder;
                Prism.highlightElement(ref.current!);
            }}/>
        </div>
    }
}
