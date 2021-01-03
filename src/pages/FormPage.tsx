/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Link } from "react-router-dom";

import { useParams } from "react-router";
import HeaderBar from "../components/HeaderBar";
import { useEffect, useState } from "react";
import { Form, getForm } from "../api/forms";
import Loading from "../components/Loading";

interface PathParams {
    id: string
}

function FormPage(): JSX.Element {
    const { id } = useParams<PathParams>();

    const [form, setForm] = useState<Form>();

    useEffect(() => {
        getForm(id).then(form => {
            setForm(form);
        });
    });

    if (!form) {
        return <Loading/>;
    }

    return <div>
        <HeaderBar title={form.name}/>
        <div css={{marginLeft: "20px"}}>
            <h1>{form.description}</h1>
            <Link to="/" css={{color: "white"}}>Return home</Link>
        </div>
    </div>;
}

export default FormPage;
