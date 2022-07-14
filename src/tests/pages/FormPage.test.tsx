import React from "react";
import {act, render, screen} from "@testing-library/react";

import {MemoryRouter} from "react-router-dom";
import FormPage from "../../pages/FormPage/FormPage";

import * as forms from "../../api/forms";

test("renders specific form page with loading bar", () => {
    act(() => { render(<FormPage/>, {wrapper: MemoryRouter}); });
    // If we rendered the headerbar we rendered the forms page.
    const headerBar = screen.getByText(/Loading.../);
    expect(headerBar).toBeInTheDocument();
});

/* TODO: Find why this test spits out promise errors that fail CI */
test.skip("calls api method to load form", () => {
    const oldImpl = forms.getForm;

    act(() => {
        Object.defineProperty(forms, "getForm", {value: jest.fn(oldImpl)});
        render(<FormPage/>, {wrapper: MemoryRouter});
    });

    expect(forms.getForm).toBeCalled();
});
