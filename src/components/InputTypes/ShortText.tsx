/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface ShortTextProps {
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function ShortText(props: ShortTextProps) {
    return <input type="text" className="text" name="value" onChange={props.handler}/>;
}
