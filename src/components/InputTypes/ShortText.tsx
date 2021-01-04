/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface ShortTextProps {
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function ShortText(props: ShortTextProps): JSX.Element {
    return <input type="text" className="short_text" placeholder="Enter Text..." onChange={props.handler}/>;
}
