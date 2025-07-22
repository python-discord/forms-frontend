/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { ChangeEvent } from "react";
import colors from "../../colors";

interface RadioProps {
    option: string,
    question_id: string,
    handler: (event: ChangeEvent<HTMLInputElement>) => void,
    onBlurHandler: () => void,
    index: number,
}

const containerStyles = css`
position: relative;
margin-bottom: 10px;
`;

const inputStyles = css`
position: absolute;
opacity: 0;
&:checked + label {
    background-color: ${colors.success};
}
`;

const labelStyles = css`
display: flex;
align-items: center;
background-color: ${colors.darkerGreyple};
padding: 10px;
border-radius: 5px;
cursor: pointer;
transition: background-color 0.25s ease, transform 0.25s ease;
transform: none;
font-weight: bolder;

:hover {
    background-color: ${colors.greyple};
    transform: translateX(5px);
}
`;

export default function Radio(props: RadioProps): JSX.Element {
    const calculatedID = `${props.question_id}-${props.index}`;

    return (
        <div css={containerStyles}>
            <input
                type="radio"
                id={calculatedID}
                name={props.question_id}
                onChange={props.handler}
                css={inputStyles}
                onBlur={props.onBlurHandler}
            />
            <label htmlFor={calculatedID} css={labelStyles}>
                {props.option}
            </label>
        </div>
    );
}
