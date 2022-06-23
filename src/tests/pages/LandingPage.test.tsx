import React from "react";
import { render, waitFor } from "@testing-library/react";

import LandingPage from "../../pages/LandingPage";
import * as forms from "../../api/forms";

import { MemoryRouter } from "react-router-dom";
import { QuestionType } from "../../api/question";

const testingForm: forms.Form = {
    "id": "testing-form",
    "name": "Testing Form",
    "description": "Meant for testing",
    "features": [forms.FormFeatures.Discoverable],
    "questions": [
        {
            "id": "my-question",
            "name": "My Question",
            "type": QuestionType.ShortText,
            "data": {},
            required: true
        }
    ],
    "webhook": null,
    submitted_text: null
};

test("renders landing page", async () => {
    jest.spyOn(forms, "getForms").mockImplementation(() => Promise.resolve([testingForm]));

    const { getByText } = render(<LandingPage/>, {wrapper: MemoryRouter});
    await waitFor(() => {
        const headerBar = getByText(/Python Discord Forms/);
        expect(headerBar).toBeInTheDocument();
    });
});
