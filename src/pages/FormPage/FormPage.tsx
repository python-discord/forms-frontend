/** @jsx jsx */
/** @jsxFrag */
import {jsx, css} from "@emotion/react";

import React, {createRef, SyntheticEvent, useEffect, useState} from "react";
import {useParams} from "react-router";
import {PropagateLoader} from "react-spinners";
import {AxiosError} from "axios";

import HeaderBar from "../../components/HeaderBar";
import RenderedQuestion from "../../components/Question";
import Loading from "../../components/Loading";
import ScrollToTop from "../../components/ScrollToTop";

import {FormFeatures, FormWithAncillaryData, getForm} from "../../api/forms";
import {OAuthScopes} from "../../api/auth";
import {unselectable} from "../../commonStyles";

import handleSubmit, {FormState} from "./submit";
import Navigation from "./Navigation";
import Success from "./SuccessPage";
import ErrorPage from "./ErrorPage";
import NotFound from "../NotFound";
import PrecheckBox from "../../components/PrecheckBox";


export type RefMapType =  Map<string, React.RefObject<RenderedQuestion>>;


const formStyles = css`
  margin: auto;
  width: 50%;

  @media (max-width: 800px) {
    /* Make form larger on mobile and tablet screens */
    width: 80%;
  }
`;

enum LoadingState {
    Pending,
    Found,
    Missing
}

function FormPage(): JSX.Element {
    const {id} = useParams<{id: string}>();

    const [form, setForm] = useState<FormWithAncillaryData>();
    const [formLoading, setFormLoading] = useState<LoadingState>(LoadingState.Pending);
    const [state, setState] = useState<string>(FormState.INITIAL);

    const OAuthRef = createRef<HTMLDivElement>();

    useEffect(() => {
        // ID can't be null due to the routing to get here
        getForm(id!).then(form => {
            setForm(form);
            setFormLoading(LoadingState.Found);
        }).catch((error: AxiosError) => {
            if (error.response?.status === 404) {
                setFormLoading(LoadingState.Missing);
                return;
            }

            throw error;
        });
    }, []);

    switch (formLoading) {
        case LoadingState.Pending:
            return <Loading/>;
        case LoadingState.Missing:
            return <NotFound message={"Could not find a matching form. Make sure the requested form exists and is open."}/>;
    }

    if (!form) {
        // This should be an impossible state
        throw Error("Form was not set despite loading state being set to found.");
    }

    const refMap: RefMapType = new Map();

    // Authentication Logic
    const require_auth: boolean = form.features.includes(FormFeatures.RequiresLogin);
    const scopes: OAuthScopes[] = [];
    if (require_auth) {
        scopes.push(OAuthScopes.Identify);
        if (form.features.includes(FormFeatures.CollectEmail)) {
            scopes.push(OAuthScopes.Email);
        }
    }

    const prechecks: JSX.Element[] = [];
    for (const precheck of form.submission_precheck.problems) {
        prechecks.push(<PrecheckBox message={precheck.message} severity={precheck.severity} key={precheck.message}/>);
    }

    const questions: RenderedQuestion[] = form.questions.map((question, index) => {
        const questionRef = createRef<RenderedQuestion>();
        refMap.set(question.id, questionRef);

        return <RenderedQuestion
            question={question}
            scroll_ref={createRef<HTMLDivElement>()}
            focus_ref={createRef<any>()} // eslint-disable-line @typescript-eslint/no-explicit-any
            key={index + Date.now()}
            selfRef={questionRef}
            ref={questionRef}
        /> as unknown as RenderedQuestion; // Annotations for JSX elements resolve to a generic ReactElement
    });

    switch (state) {
        case FormState.SENT:
            return <Success form={form}/>;
        case FormState.SENDING:
            return (
                <div>
                    <HeaderBar title={"Submitting..."}/>
                    <div css={{display: "flex", justifyContent: "center", paddingTop: "40px"}}>
                        <PropagateLoader color="white"/>
                    </div>
                </div>
            );

        case FormState.UNKNOWN_ERROR:
            return <ErrorPage
                form={form}
                message="An unknown error occurred, please contact the forms team or try again."
            />;
    }

    const handler = (event: SyntheticEvent) => handleSubmit(event, form.id, questions, refMap, setState, OAuthRef, scopes);

    return (
        <div>
            <HeaderBar title={form.name} description={form.description}/>

            <div>
                <form id="form" onSubmit={handler} css={[formStyles, unselectable]}>
                    <>
                        {...prechecks}
                        {questions}
                    </>
                </form>
                <Navigation can_submit={form.submission_precheck.can_submit} scopes={scopes}/>
            </div>

            <div css={css`margin-bottom: 10rem`}/>
            <ScrollToTop/>
        </div>
    );
}

export default FormPage;
