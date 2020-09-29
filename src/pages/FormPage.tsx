/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Link } from "react-router-dom";

function FormPage() {
    return <div css={{marginLeft: "20px"}}>
        <h1>Form page</h1>
        <Link to="/" css={{color: "white"}}>Go home</Link>
    </div>
}

export default FormPage;
