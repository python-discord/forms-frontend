/** @jsx jsx */
import { jsx } from "@emotion/react"
import { Link } from "react-router-dom";

import React, { SyntheticEvent, useEffect, useState } from "react";
import { ChangeEvent } from "react";
import { useParams } from "react-router";

import HeaderBar from "../components/HeaderBar";
import RenderedQuestion from "../components/Question";
import Loading from "../components/Loading";

import { Form, getForm } from "../api/forms";


interface PathParams {
    id: string
}

function FormPage() {
    const { id } = useParams<PathParams>();

    const [form, setForm] = useState<Form>();

    useEffect(() => {
        getForm(id).then(form => {
            setForm(form);
        })
    }, []);

    if (!form) {
        return <Loading/>
    }

    // const values: Map<string, string | boolean> = new Map();

    const questions = form.questions.map((question, index) => {
        return <RenderedQuestion question={question} key={index}/>
    });

    function handleSubmit(event: SyntheticEvent) {
        console.log(event);
        console.log(event.target);

        event.preventDefault();
    }

    return (
        <div>
            <HeaderBar title={form.name} description={form.description} key={2}/>
            <form css={{marginLeft: "2rem"}} id="form" onSubmit={handleSubmit}>
                {questions}
            </form>

            <div css={{marginLeft: "2rem", marginTop: "2rem"}}>
                <button form="form" type="submit">Submit</button>
            </div>
            <div css={{marginLeft: "2rem", marginTop: "2rem"}}>
                <Link to="/" css={{color: "white"}}>Return home</Link>
            </div>
        </div>
    )
}

export default FormPage;
