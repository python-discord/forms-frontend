/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface RangeProps {
    options: Array<string>,
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function Range(props: RangeProps) {
    return <input type="range" min={1} max={props.options.length} step={1}
                  name="value" className="range" onChange={props.handler}/>;
}
