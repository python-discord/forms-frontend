import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FormListing from "../../components/FormListing";

import { BrowserRouter as Router } from "react-router-dom";
import { Form, FormFeatures } from "../../api/forms";
import { QuestionType } from "../../api/question";

const openFormListing: Form = {
    name: "Example form listing",
    id: "example-form-listing",
    description: "My form listing",
    features: [FormFeatures.Discoverable, FormFeatures.Open],
    questions: [
        {
            "id": "my-question",
            "name": "My question",
            "type": QuestionType.ShortText,
            "data": {},
            required: false
        }
    ],
    webhook: null
};

const closedFormListing: Form = {
    name: "Example form listing",
    id: "example-form-listing",
    description: "My form listing",
    features: [FormFeatures.Discoverable],
    questions: [
        {
            "id": "what-should-i-ask",
            "name": "What should I ask?",
            "type": QuestionType.ShortText,
            "data": {},
            required: false
        }
    ],
    webhook: null
};

test("renders form listing with specified title", () => {
    const { getByText } = render(<Router><FormListing form={openFormListing} /></Router>);
    const formListing = getByText(/Example form listing/i);
    expect(formListing).toBeInTheDocument();
});

test("renders form listing with specified description", () => {
    const { getByText } = render(<Router><FormListing form={openFormListing} /></Router>);
    const formListing = getByText(/My form listing/i);
    expect(formListing).toBeInTheDocument();
});

test("renders form listing with background green colour for open", () => {
    const { container } = render(<Router><FormListing form={openFormListing} /></Router>);
    const elem = container.querySelector("a");
    const style = window.getComputedStyle(elem);
    expect(style.backgroundColor).toBe("rgb(67, 181, 129)");
});

test("renders form listing with background dark colour for closed", () => {
    const { container } = render(<Router><FormListing form={closedFormListing} /></Router>);
    const elem = container.querySelector("a");
    const style = window.getComputedStyle(elem);
    expect(style.backgroundColor).toBe("rgb(44, 47, 51)");
});
