import React from 'react';
import { render } from '@testing-library/react';
import FormListing from "../../components/FormListing";

test('renders form listing with specified title', () => {
    const { getByText } = render(<FormListing title="Example form listing" description="My form listing" open={true} />);
    const formListing = getByText(/Example form listing/i);
    expect(formListing).toBeInTheDocument();
});

test('renders form listing with specified description', () => {
    const { getByText } = render(<FormListing title="Example form listing" description="My form listing" open={true} />);
    const formListing = getByText(/My form listing/i);
    expect(formListing).toBeInTheDocument();
});

test('renders form listing with background green colour for open', () => {
    const { container } = render(<FormListing title="Example form listing" description="My form listing" open={true} />);
    const elem = container.querySelector("div");
    const style = window.getComputedStyle(elem);
    expect(style.backgroundColor).toBe("rgb(67, 181, 129)");
});

test('renders form listing with background dark colour for closed', () => {
    const { container } = render(<FormListing title="Example form listing" description="My form listing" open={false} />);
    const elem = container.querySelector("div");
    const style = window.getComputedStyle(elem);
    expect(style.backgroundColor).toBe("rgb(44, 47, 51)");
});
