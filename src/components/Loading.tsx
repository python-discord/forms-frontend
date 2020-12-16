/** @jsx jsx */
import { jsx } from "@emotion/react";

import { HashLoader } from "react-spinners";

import HeaderBar from "../components/HeaderBar";

function Loading() {
    return <div>
        <HeaderBar title={"Loading..."}/>
        <div css={{display: "flex", justifyContent: "center"}}>
            <HashLoader color="white"/>
        </div>
    </div>
}

export default Loading;
