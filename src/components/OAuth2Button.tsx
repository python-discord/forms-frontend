/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import authenticate, { OAuthScopes } from "../api/auth";


interface OAuth2ButtonProps {
    scopes?: OAuthScopes[],
    path?: string
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

    return (
        <button disabled={disabled} onClick={() => authenticate(props.scopes, setDisabled, props.path)}>
            <FontAwesomeIcon icon={faDiscord} css={iconStyles}/>
            <span css={textStyles}>Discord Login</span>
        </button>
    );
}

export default OAuth2Button;
