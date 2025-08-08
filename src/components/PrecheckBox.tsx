/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";

interface PrecheckProps {
    severity: "secondary" | "warning" | "danger"
    message: string
}

const BACKGROUNDS = {
    secondary: "#7e7c7cff",
    warning: "#a09b53ff",
    danger: "#b4747aff"
};

interface PrecheckBoxProps {
    severity: PrecheckProps["severity"]
}


const HeaderBox = styled.div<PrecheckBoxProps>`
    margin-bottom: 2rem;
    padding: 1rem 4rem;
    border-radius: 8px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bolder;

    background-color: ${props => BACKGROUNDS[props.severity]};

    @media (max-width: 500px) {
        padding: 1rem 1.5rem;
    }
`;

function PrecheckBox(props: PrecheckProps): JSX.Element {
    return <HeaderBox severity={props.severity}>
        {props.message}
    </HeaderBox>;
}

export default PrecheckBox;
