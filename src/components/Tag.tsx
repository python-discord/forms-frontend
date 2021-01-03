/** @jsx jsx */
import { css, jsx } from "@emotion/react";

interface TagProps {
    text: string,
    color: string,
    fontSize?: string
}

function Tag(props: TagProps): JSX.Element {
    return <span css={css`
        font-size: ${props.fontSize ? props.fontSize : "0.75em"};
        background-color: ${props.color};
        border-radius: 5px;
        margin: 0;
        padding-top: 3px;
        margin-right: 5px;
        padding-left: 5px;
        padding-right: 5px;
    `}>
        {props.text}
    </span>;
}

export default Tag;
