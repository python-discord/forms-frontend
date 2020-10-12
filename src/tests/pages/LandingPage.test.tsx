import React from 'react';
import { render } from '@testing-library/react';

import LandingPage from "../../pages/LandingPage";

import { BrowserRouter as Router } from "react-router-dom";

test('renders landing page', () => {
    const { getByText } = render(<Router><LandingPage /></Router>);
    // If we rendered the headerbar we rendered the landing page.
    let headerBar = getByText(/Python Discord Forms/);
    expect(headerBar).toBeInTheDocument();
});
