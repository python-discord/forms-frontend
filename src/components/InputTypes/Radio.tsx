/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface RadioProps {
    option: string,
    name: string,
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function Radio(props: RadioProps) {
    return (
        <label className="radio_label">
            <input type="radio" name={props.name} className="radio" onChange={props.handler}/>
            {props.option}<br/>
        </label>
    );
}
