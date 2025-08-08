/** @jsx jsx */
import {jsx} from "@emotion/react";
import React, {useState} from "react";
import {Link} from "react-router-dom";

import * as styles from "../../commonStyles";
import {checkScopes, OAuthScopes} from "../../api/auth";
import OAuth2Button from "../../components/OAuth2Button";


interface NavigationProps {
    can_submit: boolean,
    scopes: OAuthScopes[]
}

export default function Navigation(props: NavigationProps): JSX.Element {
    const [authorized, setAuth] = useState<boolean>(!(
        props.scopes.includes(OAuthScopes.Identify) && !checkScopes(props.scopes)
    ));

    let innerElement;
    if (!authorized) {
        innerElement = <OAuth2Button disabled={!props.can_submit} rerender={() => setAuth(true)} scopes={props.scopes}/>;
    } else {
        innerElement = <button disabled={!props.can_submit} form="form" type="submit">Submit</button>;
    }
    let submit = <div css={styles.actionButtonStyles}>{innerElement}</div>;

    return (
        <div css={[styles.unselectable, styles.mainTextStyles]}>
            <div css={styles.navigationStyles}>
                <Link to="/" css={styles.returnButtonStyles}>Return Home</Link>
                { submit }
            </div>
        </div>
    );
}
