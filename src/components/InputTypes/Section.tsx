/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent } from "react";

interface SectionProps {
    handler: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function Section(props: SectionProps) {
    return <input type="text" className="text" name="value" onChange={props.handler}/>;
}
