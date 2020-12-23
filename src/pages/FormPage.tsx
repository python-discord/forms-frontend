/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import { Link } from "react-router-dom";

import React, { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router";

import HeaderBar from "../components/HeaderBar";
import RenderedQuestion from "../components/Question";
import Loading from "../components/Loading";

import { Form, getForm } from "../api/forms";
// @ts-ignore
import styles from "./css/FormPage.css";


import gray_circle from "!url-loader!./css/gray-circle.svg";
import green_checkmark from "!url-loader!./css/green-checkmark.svg";
const form_css_extra = css`
  #unselected_checkbox_label {
    background: no-repeat center / 100% url(${gray_circle});
  }

  #selected_checkbox_label {
    background: no-repeat center / 100% url(${green_checkmark});
  }
`;

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
                    console.log(question.name, prop.props.public_state);
            }
        });

        event.preventDefault();
    }

    return (
        <div>
            <HeaderBar title={form.name} description={form.description} key={2}/>
            <div css={css`${styles}; ${form_css_extra}`}>
                <form id="form" onSubmit={handleSubmit} className="unselectable">
                    {questions}
                </form>
            </div>

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
