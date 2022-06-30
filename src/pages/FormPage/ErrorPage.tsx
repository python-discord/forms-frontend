/** @jsx jsx */
import {jsx, css} from "@emotion/react";
import {Link} from "react-router-dom";
import React from "react";

import HeaderBar from "../../components/HeaderBar";
import RenderedQuestion from "../../components/Question";

import {Form} from "../../api/forms";
import {selectable, submitStyles, unselectable} from "../../commonStyles";

import Navigation from "./Navigation";


interface ErrorProps {
    form: Form
    questions: RenderedQuestion[]
    message: string
}

const refreshStyles = css`
    padding: 0.55rem 4.25rem;
`;


export default function ErrorPage(props: ErrorProps): JSX.Element {
    return (
        <div>
            <HeaderBar title={props.form.name} description={props.form.description}/>
            <div css={[unselectable, Navigation.containerStyles]}>
                <h3 css={selectable}>{props.message}</h3>
                <div className={ "return_button" }>
                    <Link to="/" css={Navigation.returnStyles}>Return Home</Link>
                </div>
                <br css={Navigation.separatorStyles}/>
                <div css={submitStyles}>
                    <button
                        type="button" css={refreshStyles}
                        onClick={location.reload.bind(window.location)} // TODO: State should probably be saved here
                    >
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
}
