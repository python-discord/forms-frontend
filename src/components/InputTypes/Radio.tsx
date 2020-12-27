/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface RadioProps {
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function Radio(props: RadioProps) {
    return <input type="radio" className="radio" name="value" onChange={props.handler}/>;
}
