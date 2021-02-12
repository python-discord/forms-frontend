/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import authenticate, {checkScopes, OAuthScopes} from "../api/auth";


interface OAuth2ButtonProps {
    scopes?: OAuthScopes[],
    path?: string,
    rerender: () => void
}

const iconStyles = css`
  position: relative;
  top: 0.3rem;
  padding-left: 0.65rem;
  font-size: 1.2em;
`;

const textStyles = css`
  display: inline-block;
  padding: 0.5rem 0.75rem 0.5rem 0.5rem;
`;

function OAuth2Button(props: OAuth2ButtonProps): JSX.Element {
    const [disabled, setDisabled] = useState<boolean>(false);
    async function login() {
        await authenticate(props.scopes, setDisabled, props.path);

        if (checkScopes(props.scopes, props.path)) {
            props.rerender();
        }
    }

    return (
        <button disabled={disabled} onClick={() => login()}>
            <FontAwesomeIcon icon={faDiscord} css={iconStyles}/>
            <span css={textStyles}>Discord Login</span>
        </button>
    );
}

export default OAuth2Button;
