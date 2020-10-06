/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState } from "react";

export default function CallbackPage() {
    const [hasSent, setHasSent] = useState(false);
    const params = new URLSearchParams(document.location.search);

    const code = params.get("code");

    if (!hasSent) {
        setHasSent(true);
        window.opener.postMessage(code);
    }

    return <p>Code is {code}</p>;
}
