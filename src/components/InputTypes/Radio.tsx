/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface RadioProps {
    option: string,
    question_id: string,
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function Radio(props: RadioProps): JSX.Element {
    return (
        <label>
            <input type="radio" name={props.question_id} css={css`margin: 1rem 0.5rem 0 0;`} onChange={props.handler}/>
            {props.option}<br/>
        </label>
    );
}
