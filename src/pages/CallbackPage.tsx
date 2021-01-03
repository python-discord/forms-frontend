/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";

export default function CallbackPage(): JSX.Element {
    const [hasSent, setHasSent] = useState(false);
    const params = new URLSearchParams(location.search);

    const code = params.get("code");

    if (!hasSent) {
        setHasSent(true);
        window.opener.postMessage(code);
    }

    return <p>Code is {code}</p>;
}
