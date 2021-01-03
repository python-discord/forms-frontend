/** @jsx jsx */
import { jsx } from "@emotion/react";

import { PropagateLoader } from "react-spinners";

import HeaderBar from "../components/HeaderBar";

function Loading(): JSX.Element {
    return <div>
        <HeaderBar title={"Loading..."}/>
        <div css={{display: "flex", justifyContent: "center", paddingTop: "40px"}}>
            <PropagateLoader color="white"/>
        </div>
    </div>;
}

export default Loading;
