/** @jsx jsx */
import { jsx } from "@emotion/react";

import { RingLoader } from "react-spinners";

import HeaderBar from "../components/HeaderBar";

function Loading() {
    return <div>
        <HeaderBar title={"Loading..."}/>
        <div css={{display: "flex", justifyContent: "center"}}>
            <RingLoader color="white"/>
        </div>
    </div>
}

export default Loading;
