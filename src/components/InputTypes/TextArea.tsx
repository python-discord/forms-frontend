/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface TextAreaProps {
    handler: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

export default function TextArea(props: TextAreaProps) {
    return <textarea className="text_area" placeholder="Enter Text..." onChange={props.handler}/>;
}
