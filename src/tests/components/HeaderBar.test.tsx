import React from "react";
import { render } from "@testing-library/react";
import HeaderBar from "../../components/HeaderBar";
import { MemoryRouter } from "react-router-dom";

test("renders header bar with title", () => {
    const { getByText } = render(<MemoryRouter><HeaderBar /></MemoryRouter>);
    const formListing = getByText(/Python Discord Forms/i);
    expect(formListing).toBeInTheDocument();
});

test("renders header bar with custom title", () => {
    const { getByText } = render(<MemoryRouter><HeaderBar title="Testing title"/></MemoryRouter>);
    const formListing = getByText(/Testing title/i);
    expect(formListing).toBeInTheDocument();
});

test("renders header bar with custom description", () => {
    const { getByText } = render(<MemoryRouter><HeaderBar description="Testing description"/></MemoryRouter>);
    const formListing = getByText(/Testing description/i);
    expect(formListing).toBeInTheDocument();
});

test("renders header bar with custom title and description", () => {
    const { getByText } = render(
        <MemoryRouter>
            <HeaderBar title="Testing Title" description="Testing description"/>
        </MemoryRouter>
    );

    const title = getByText(/Testing title/i);
    const description = getByText(/Testing description/i);
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
});
