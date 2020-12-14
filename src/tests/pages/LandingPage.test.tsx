import React from 'react';
import { render } from '@testing-library/react';

import LandingPage from "../../pages/LandingPage";
import * as forms from "../../api/forms";

import { BrowserRouter as Router } from "react-router-dom";
import { QuestionType } from '../../api/question';

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
            "data": {}
        }
    ]
}

test('renders landing page', () => {
    const setForms = jest.fn(() => [testingForm]);
    Object.defineProperty(forms, "getForms", setForms);
    const handleForms = jest.spyOn(React, "useState");
    handleForms.mockImplementation(_value => [[testingForm], setForms]);
    const { getByText } = render(<Router><LandingPage /></Router>);
    // If we rendered the headerbar we rendered the landing page.
    let headerBar = getByText(/Python Discord Forms/);
    expect(headerBar).toBeInTheDocument();
});
