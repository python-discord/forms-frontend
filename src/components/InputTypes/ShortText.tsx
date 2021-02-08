/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent, FocusEvent } from "react";
import { textInputs, invalidStyles } from "../../commonStyles";

interface ShortTextProps {
    handler: (event: ChangeEvent<HTMLInputElement>) => void,
    onBlurHandler: (event: FocusEvent<HTMLInputElement>) => void,
    valid: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    focus_ref: React.RefObject<any>
}

export default function ShortText(props: ShortTextProps): JSX.Element {
    return (
        <div css={invalidStyles}>
            <input type="text" css={textInputs} placeholder="Enter Text..." onChange={props.handler} onBlur={props.onBlurHandler} className={!props.valid ? "invalid-box" : ""} ref={props.focus_ref}/>
        </div>
    );
}
