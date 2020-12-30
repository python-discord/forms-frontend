/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface RadioProps {
    option: string,
    question_id: string,
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function Radio(props: RadioProps) {
    return (
        <label>
            <input type="radio" name={props.question_id} className="radio" onChange={props.handler}/>
            {props.option}<br/>
        </label>
    );
}
