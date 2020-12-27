/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface CodeProps {
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function Code(props: CodeProps) {
    return <input type="text" className="text" name="value" onChange={props.handler}/>;
}
