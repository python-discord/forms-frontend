import React from "react";
import { render } from "@testing-library/react";
import Tag from "../../components/Tag";

test("renders tag with specified text", () => {
    const { getByText } = render(<Tag text="Test" color="#f0f0f0" />);
    const tag = getByText(/Test/i);
    expect(tag).toBeInTheDocument();
});

test("renders tag with specified color", () => {
    const { getByText } = render(<Tag text="Test" color="#f0f0f0" />);
    const tag = getByText(/Test/i);
    const style = window.getComputedStyle(tag);
    expect(style.backgroundColor).toBe("rgb(240, 240, 240)");
});

test("renders tag with specified font size", () => {
    const { getByText } = render(<Tag text="Test" color="#f0f0f0" fontSize="2em" />);
    const tag = getByText(/Test/i);
    const style = window.getComputedStyle(tag);
    expect(style.fontSize).toBe("2em");
});

test("defaults to 0.75em when no tag font size is passed", () => {
    const { getByText } = render(<Tag text="Test" color="#f0f0f0" />);
    const tag = getByText(/Test/i);
    const style = window.getComputedStyle(tag);
    expect(style.fontSize).toBe("0.75em");
});
