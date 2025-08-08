/** @jsx jsx */
import Cookies from "universal-cookie";
import { jsx } from "@emotion/react";
import { render } from "@testing-library/react";
import Navigation from "../../../pages/FormPage/Navigation";
import {MemoryRouter} from "react-router-dom";
import { OAuthScopes, CookieNames } from "../../../api/auth";

test("navigation shows submit when form is open and no auth required", () => {
    const { getByRole } = render(<Navigation form_state={true} scopes={[]} />, { wrapper: MemoryRouter });
    const submitButton = getByRole("button");

    expect(submitButton).not.toBeNull();
    expect(submitButton.innerHTML).toBe("Submit");
});

test("navigation shows oauth button when form is open and auth is required", () => {
    const { getByRole } = render(<Navigation form_state={true} scopes={[OAuthScopes.Identify]} />, { wrapper: MemoryRouter });
    const loginButton = getByRole("button");

    expect(loginButton).not.toBeNull();
    expect(loginButton.textContent).toBe("Login To Submit");
});

test("navigation shows submit button when form is open and auth is present", () => {
    new Cookies().set(CookieNames.Scopes, [OAuthScopes.Identify]);
    const { getByRole } = render(<Navigation form_state={true} scopes={[OAuthScopes.Identify]} />, { wrapper: MemoryRouter });
    const loginButton = getByRole("button");

    expect(loginButton).not.toBeNull();
    expect(loginButton.textContent).toBe("Submit");
});

test("navigation shows login button when form is open and auth is present but insufficient scopes", () => {
    new Cookies().set(CookieNames.Scopes, [OAuthScopes.Identify]);
    const { getByRole } = render(<Navigation form_state={true} scopes={[OAuthScopes.Identify, OAuthScopes.Guilds]} />, { wrapper: MemoryRouter });
    const loginButton = getByRole("button");

    expect(loginButton).not.toBeNull();
    expect(loginButton.textContent).toBe("Login To Submit");
});
