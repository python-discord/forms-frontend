/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { atomone } from "@uiw/codemirror-theme-atomone";

import { selectable } from "../../commonStyles";

interface CodeProps {
    handler: (newContent: string) => void,
    questionId: string,
}

const styles = css`
  border: 3px solid lightgray;
  border-radius: 5px;
  overflow:auto;
  height: 20rem;
  
  .cm-editor {
    height: 100%;
  }
`;

export default function Code(props: CodeProps): JSX.Element {
    const onChange = React.useCallback((val: string) => {
        props.handler(val);
    }, []);

    return <CodeMirror value="" css={[styles, selectable]} height="20rem" theme={atomone} extensions={[python()]} onChange={onChange} />;
}
