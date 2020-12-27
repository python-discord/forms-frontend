/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface TextAreaProps {
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function TextArea(props: TextAreaProps) {
    return <input type="text" className="text" name="value" onChange={props.handler}/>;
}
