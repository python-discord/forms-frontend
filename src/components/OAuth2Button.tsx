/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import colors from "../colors";

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

&:hover {
  filter: brightness(110%);
  cursor: pointer;
}
`;

function OAuth2Button() {
  return <button css={buttonStyling}>
    <span css={{marginRight: "10px"}}><FontAwesomeIcon icon={faDiscord} css={{fontSize: "2em", marginTop: "3px"}}/></span>
    <span>Sign in with Discord</span>
  </button>;
}

export default OAuth2Button;
