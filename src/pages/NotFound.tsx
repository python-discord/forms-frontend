/** @jsx jsx */
import {jsx, css} from "@emotion/react";
import {Link} from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import {mainTextStyles, navigationStyles, returnButtonStyles, unselectable} from "../commonStyles";

interface NotFoundProps {
    message: string
}


/** Simple 404 page. */
export default function NotFound(props: NotFoundProps): JSX.Element {
    return <div>
        <HeaderBar/>
        <div css={css`width: 80%; margin: auto;`}>
            <div css={mainTextStyles}>
                <p>{props.message}</p>
            </div>
            <div css={[unselectable, navigationStyles]}>
                <Link css={returnButtonStyles} to="/">Return Home</Link>
            </div>
        </div>
    </div>;
}
