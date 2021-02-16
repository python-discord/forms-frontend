/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import authenticate, { APIErrors, checkScopes, OAuthScopes } from "../api/auth";
import { selectable } from "../commonStyles";


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

const errorStyles =  css`
  position: absolute;
  visibility: hidden;
  width: 100%;
  left: 0;
  
  text-align: center;
  white-space: normal;
  box-sizing: border-box;
  
  padding: 0 15rem;
  @media (max-width: 750px) {
    padding: 0 5rem;
  }
  
  color: red;
  margin-top: 2.5rem;
`;

async function login(props: OAuth2ButtonProps, errorDialog: React.RefObject<HTMLDivElement>, setDisabled: (newState: boolean) => void) {
    await authenticate(props.scopes, setDisabled, props.path).catch((reason: APIErrors) => {
        // Display Error Message
        if (errorDialog.current) {
            errorDialog.current.style.visibility = "visible";
            errorDialog.current.textContent = reason.Message;
            errorDialog.current.scrollIntoView({behavior: "smooth"});
        }

        // Propagate to sentry
        const error = reason.Error;
        error["Custom Error Message"] = reason.Message;

        // Filter Discord code
        if (error?.config?.data) {
            const data = JSON.parse(error.config.data);
            if (data["token"]) {
                data["token"] = "[FILTERED]";
            }

            error.config.data = data;
        }

        throw error;
    });

    if (checkScopes(props.scopes, props.path)) {
        props.rerender();
    }
}

function OAuth2Button(props: OAuth2ButtonProps): JSX.Element {
    const [disabled, setDisabled] = useState<boolean>(false);
    const errorDialog: React.RefObject<HTMLDivElement> = React.useRef(null);

    return <span>
        <button disabled={disabled} onClick={() => login(props, errorDialog, setDisabled)}>
            <FontAwesomeIcon icon={faDiscord} css={iconStyles}/>
            <span css={textStyles}>Discord Login</span>
        </button>
        <div css={[errorStyles, selectable]} ref={errorDialog}/>
    </span>;
}

export default OAuth2Button;
