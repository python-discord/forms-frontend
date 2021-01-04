/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface CheckboxProps {
    index: number,
    option: string,
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function Checkbox(props: CheckboxProps): JSX.Element {
    return (
        <label>
            <label className="unselected_checkbox_label checkbox_label unselectable">
                <input type="checkbox" value={props.option}
                    name={`${("000" + props.index).slice(-4)}. ${props.option}`} onChange={props.handler}/>
                <span className="checkmark_span"/>
            </label>
            {props.option}<br/>
        </label>
    );
}
