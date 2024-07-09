/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { useSelector } from "react-redux";
import { type RootState } from "../store";

const splashStyles = css`
position: fixed;
width: 100%;
height: 100%;
top: 0;
transition: background-color 0.5s ease, opacity 0.5s ease;
`;

const innerText = css`
text-align: center;
vertical-align: middle;
`;

const spacer = css`
height: 30%;
`;

function AuthorizationSplash(): JSX.Element {
    const authorizing = useSelector<RootState, boolean>(state => state.authorization.authorizing);

    const background = `rgba(0, 0, 0, ${authorizing ? "0.90" : "0"})`;

    return <div css={css`
          ${splashStyles}
          background-color: ${background};
          opacity: ${authorizing ? "1" : "0"};
          z-index: ${authorizing ? "10" : "-10"};
        `}>
        <div css={spacer}/>
        <div css={innerText}>
            <h1 css={{fontSize: "3em"}}>Authorization in progress</h1>
            <h2>Login with Discord in the opened window and return to this tab once complete.</h2>
        </div>
    </div>;
}

export default AuthorizationSplash;
