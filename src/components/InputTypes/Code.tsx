/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useEffect } from "react";

import { basicSetup } from "@codemirror/basic-setup";
import { python } from "@codemirror/lang-python";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, ViewUpdate } from "@codemirror/view";

interface CodeProps {
    handler: (newContent: string) => void,
    questionId: string,
}

export default function Code(props: CodeProps): JSX.Element {
    const onUpdate = () => EditorView.updateListener.of((v: ViewUpdate) => {
        props.handler(v.state.doc.toString());
    });

    useEffect(() => {
        const el = document.getElementById(`${props.questionId}-code`);
        const state = EditorState.create({
            extensions: [basicSetup, python(), onUpdate(), oneDark]
        });
        const view = new EditorView({
            state,
            parent: el as Element
        });

        return () => view.destroy();
    }, []);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <div id={`${props.questionId}-code`}/>;
}
