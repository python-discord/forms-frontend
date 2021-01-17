/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";
import { textInputs } from "../../commonStyles";

interface ShortTextProps {
    handler: (event: ChangeEvent<HTMLInputElement>) => void,
    required: boolean
}

export default function ShortText(props: ShortTextProps): JSX.Element {
    return <input type="text" css={textInputs} placeholder="Enter Text..." onChange={props.handler}/>;
}
