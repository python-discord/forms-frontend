/** @jsx jsx */
import {jsx} from "@emotion/react";
import React, {useState} from "react";
import {Link} from "react-router-dom";

import * as styles from "../../commonStyles";
import {checkScopes, OAuthScopes} from "../../api/auth";
import OAuth2Button from "../../components/OAuth2Button";


interface NavigationProps {
    form_state: boolean,  // Whether the form is open or not
    scopes: OAuthScopes[]
}

export default function Navigation(props: NavigationProps): JSX.Element {
    const [authorized, setAuth] = useState<boolean>(!(
        props.scopes.includes(OAuthScopes.Identify) && !checkScopes(props.scopes)
    ));

    let submit = null;
    if (props.form_state) {
        let innerElement;
        if (!authorized) {
            innerElement = <OAuth2Button rerender={() => setAuth(true)} scopes={props.scopes}/>;
        } else {
            innerElement = <button form="form" type="submit">Submit</button>;
        }
        submit = <div css={styles.actionButtonStyles}>{innerElement}</div>;
    }

    return (
        <div css={[styles.unselectable, styles.mainTextStyles]}>
            <div css={styles.navigationStyles}>
                <Link to="/" css={styles.returnButtonStyles}>Return Home</Link>
                { submit }
            </div>
        </div>
    );
}
