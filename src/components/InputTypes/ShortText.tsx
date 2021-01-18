/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent, FocusEvent } from "react";
import { textInputs, invalidStyles } from "../../commonStyles";

interface ShortTextProps {
    handler: (event: ChangeEvent<HTMLInputElement>) => void,
    blurHandler: (event: FocusEvent<HTMLInputElement>) => void,
    valid: boolean
}

export default function ShortText(props: ShortTextProps): JSX.Element {
    return (
        <div css={invalidStyles}>
            <input type="text" css={textInputs} placeholder="Enter Text..." onChange={props.handler} onBlur={props.blurHandler} className={!props.valid ? "invalid-box" : ""}/>
        </div>
    );
}
