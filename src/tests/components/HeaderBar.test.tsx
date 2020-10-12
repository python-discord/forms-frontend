import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import HeaderBar from "../../components/HeaderBar";

test('renders header bar with title', () => {
    const { getByText } = render(<HeaderBar />);
    const formListing = getByText(/Python Discord Forms/i);
    expect(formListing).toBeInTheDocument();
});

test('renders header bar with custom title', () => {
    const { getByText } = render(<HeaderBar title="Testing title"/>);
    const formListing = getByText(/Testing title/i);
    expect(formListing).toBeInTheDocument();
});

