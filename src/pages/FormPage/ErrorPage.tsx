/** @jsx jsx */
import {jsx, css} from "@emotion/react";
import {Link} from "react-router-dom";
import React from "react";

import HeaderBar from "../../components/HeaderBar";

import {Form} from "../../api/forms";
import {clearAuth} from "../../api/auth";
import * as styles from "../../commonStyles";


interface ErrorProps {
    form: Form
    message: string
}

const refreshStyles = css`
    padding: 0.55rem 4.25rem;
`;


export default function ErrorPage(props: ErrorProps): JSX.Element {
    clearAuth();

    return (
        <div>
            <HeaderBar title={props.form.name} description={props.form.description}/>
            <div css={[styles.unselectable, styles.mainTextStyles]}>
                <h3 css={styles.selectable}>{props.message}</h3>
                <div css={styles.navigationStyles}>
                    <Link css={styles.returnButtonStyles} to="/">Return Home</Link>
                    <div css={styles.actionButtonStyles}>
                        <button
                            type="button" css={refreshStyles}
                            onClick={location.reload.bind(window.location)} // TODO: State should probably be saved here
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
