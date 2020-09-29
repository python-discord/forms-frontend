import React from 'react';
import { render } from '@testing-library/react';
import FormListing from "../../components/FormListing";

import { BrowserRouter as Router } from 'react-router-dom';

test('renders form listing with specified title', () => {
    const { getByText } = render(<Router><FormListing title="Example form listing" description="My form listing" open={true} /></Router>);
    const formListing = getByText(/Example form listing/i);
    expect(formListing).toBeInTheDocument();
});

test('renders form listing with specified description', () => {
    const { getByText } = render(<Router><FormListing title="Example form listing" description="My form listing" open={true} /></Router>);
    const formListing = getByText(/My form listing/i);
    expect(formListing).toBeInTheDocument();
});

test('renders form listing with background green colour for open', () => {
    const { container } = render(<Router><FormListing title="Example form listing" description="My form listing" open={true} /></Router>);
    const elem = container.querySelector("a");
    const style = window.getComputedStyle(elem);
    expect(style.backgroundColor).toBe("rgb(67, 181, 129)");
});

test('renders form listing with background dark colour for closed', () => {
    const { container } = render(<Router><FormListing  title="Example form listing" description="My form listing" open={false} /></Router>);
    const elem = container.querySelector("a");
    const style = window.getComputedStyle(elem);
    expect(style.backgroundColor).toBe("rgb(44, 47, 51)");
});
