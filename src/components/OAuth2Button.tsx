/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import colors from "../colors";
import { useState } from "react";

const OAUTH2_CLIENT_ID = process.env.REACT_APP_OAUTH2_CLIENT_ID;

const buttonStyling = css`
display: flex;
background-color: ${colors.blurple};
border: none;
color: white;
font-family: "Hind", "Helvetica", "Arial", sans-serif;
border-radius: 5px;
padding-top: 10px;
padding-bottom: 10px;
padding-right: 20px;
padding-left: 20px;
outline: none;
transition: filter 100ms;
font-size: 1.2em;
align-items: center;

span {
  vertical-align: middle;
}

&:hover:enabled {
  filter: brightness(110%);
  cursor: pointer;
}

&:disabled {
  background-color: ${colors.greyple};
}
`;

function doLogin(disableFunction: (newState: boolean) => void) {
  disableFunction(true);

  const redirectURI = encodeURIComponent(document.location.protocol + "//" + document.location.host + "/callback");

  const windowRef = window.open(
    `https://discord.com/api/oauth2/authorize?client_id=${OAUTH2_CLIENT_ID}&response_type=code&scope=identify&redirect_uri=${redirectURI}&prompt=none`,
    "Discord_OAuth2",
    "height=700,width=500,location=no,menubar=no,resizable=no,status=no,titlebar=no,left=300,top=300"
  )

  const interval = setInterval(() => {
    if (windowRef?.closed) {
      clearInterval(interval);
      disableFunction(false);
    }
  }, 500)

  window.onmessage = (code: MessageEvent) => {
    if (code.data.hello) {
      // React DevTools has a habit of sending messages, ignore them.
      return;
    }

    if (code.isTrusted) {
      windowRef?.close();

      console.log("Code received:", code.data);

      disableFunction(false);
      clearInterval(interval);

      window.onmessage = null;
    }
  };
}

function OAuth2Button() {
  const [disabled, setDisabled] = useState<boolean>(false);

  return <button disabled={disabled} onClick={() => doLogin(setDisabled)} css={buttonStyling}>
    <span css={{marginRight: "10px"}}><FontAwesomeIcon icon={faDiscord} css={{fontSize: "2em", marginTop: "3px"}}/></span>
    <span>Sign in with Discord</span>
  </button>;
}

export default OAuth2Button;
