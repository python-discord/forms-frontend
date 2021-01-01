/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import { Link } from "react-router-dom";

import React, { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router";

import HeaderBar from "../components/HeaderBar";
import RenderedQuestion from "../components/Question";
import Loading from "../components/Loading";
import ScrollToTop from "../components/ScrollToTop";

import { Form, FormFeatures, getForm } from "../api/forms";


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

    const questions = form.questions.map((question, index) => {
        return <RenderedQuestion question={question} public_state={new Map()} key={index}/>
    });

    function handleSubmit(event: SyntheticEvent) {
        questions.forEach(prop => {
            const question = prop.props.question;

            // TODO: Parse input from each question, and submit
            switch (question.type) {
                default:
                    console.log(question.id, prop.props.public_state);
            }
        });

        event.preventDefault();
    }

    const open: boolean = form.features.includes(FormFeatures.Open)

    let closed_header = null;
    let submit = null;

    if (open) {
        submit = (
            <div className="submit_form">
                <button form="form" type="submit">Submit</button>
            </div>
        )
    } else {
        closed_header = (
            <div className="closed_header">
                <div>This form is now closed. You will not be able to submit your response.</div>
            </div>
        )
    }


    return (
        <div>
            <HeaderBar title={form.name} description={form.description} key={2}/>
            <div css={css`${require("./css/FormPage.css")};`}>
                <form id="form" onSubmit={handleSubmit} className="unselectable">
                    { closed_header }
                    {questions}
                </form>
                <div className="nav unselectable">
                    <div className={ "nav_buttons" + (open ? "" : " closed") }>
                        <Link to="/" className="return_home">Return Home</Link>
                    </div>
                    <br className="nav_separator"/>
                    { submit }
                </div>
            </div>
            <div css={css`margin-bottom: 10rem`}/>
            <ScrollToTop/>
        </div>
    )
}

export default FormPage;
