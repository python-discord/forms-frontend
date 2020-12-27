/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface SelectProps {
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function Select(props: SelectProps) {
    return <input type="text" className="text" name="value" onChange={props.handler}/>;
}
