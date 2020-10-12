import React from 'react';
import { render } from '@testing-library/react';

import { createMemoryHistory } from "history";

import { Route, BrowserRouter as Router } from "react-router-dom";
import FormPage from '../../pages/FormPage';

import * as forms from "../../api/forms";

test('renders specific form page with loading bar', () => {
    const history = createMemoryHistory();
    history.push("/form/route");

    const { getByText } = render(<Router><Route history={history} ><FormPage /></Route></Router>);
    // If we rendered the headerbar we rendered the forms page.
    let headerBar = getByText(/Loading.../);
    expect(headerBar).toBeInTheDocument();
});

test('calls api method to load form', () => {
    const history = createMemoryHistory();
    history.push("/form/ban-appeals");

    let oldImpl = forms.getForm;

    Object.defineProperty(forms, "getForm", {value: jest.fn(oldImpl)});

    render(<Router><Route history={history}><FormPage /></Route></Router>);
    
    expect(forms.getForm).toBeCalled();
});
