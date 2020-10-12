import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OAuth2Button from "../../components/OAuth2Button";

test('renders oauth2 sign in button text', () => {
    const { getByText } = render(<OAuth2Button />);
    const button = getByText(/Sign in with Discord/i);
    expect(button).toBeInTheDocument();
});

test("renders fontawesome discord icon", () => {
    const { container } = render(<OAuth2Button/>);
    const icon = container.querySelector(`[data-icon="discord"]`)
    expect(icon).toBeInTheDocument();
})
