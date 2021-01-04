/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface TextAreaProps {
    handler: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

export default function TextArea(props: TextAreaProps): JSX.Element {
    return <textarea className="text_area" placeholder="Enter Text..." onChange={props.handler}/>;
}
