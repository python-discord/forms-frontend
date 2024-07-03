/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";

export default function CallbackPage(): JSX.Element {
    const [hasSent, setHasSent] = useState(false);
    const params = new URLSearchParams(location.search);

    const code = params.get("code");
    const state = params.get("state");

    if (!hasSent) {
        setHasSent(true);
        window.opener.postMessage({code: code, state: state, pydis_source: "oauth2_callback"});
    }

    return <div/>;
}
