/** @jsx jsx */
import {jsx, css} from "@emotion/react";
import {Link} from "react-router-dom";

import {Form} from "../../api/forms";
import HeaderBar from "../../components/HeaderBar";
import {unselectable} from "../../commonStyles";

import Navigation from "./Navigation";


interface SuccessProps {
    form: Form
}

const thanksStyle = css`
  font-family: "Uni Sans", "Hind", "Arial", sans-serif;
  margin-top: 15.5rem;
`;

const divStyle = css`
  width: 80%;
`;

export default function Success(props: SuccessProps): JSX.Element {
    let submitted_text;
    if (props.form.submitted_text) {
        submitted_text = props.form.submitted_text.split("\n").map((line, index) => <span key={index}>{line}<br/></span>);
        submitted_text.push(<span key={submitted_text.length - 1}>{submitted_text.pop()?.props.children[0]}</span>);
    } else {
        submitted_text = "Thanks for your response!";
    }

    return (
        <div>
            <HeaderBar title={props.form.name} description={props.form.description}/>
            <div css={[unselectable, Navigation.containerStyles, divStyle]}>
                <h3 css={thanksStyle}>{submitted_text}</h3>
                <div className={"return_button closed"}>
                    <Link to="/" css={Navigation.returnStyles}>Return Home</Link>
                </div>
            </div>
        </div>
    );
}
