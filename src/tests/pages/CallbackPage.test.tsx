import React from "react";
import { render } from "@testing-library/react";

import CallbackPage from "../../pages/CallbackPage";

test("callback page renders provided code", () => {
    global.opener = {
        postMessage: jest.fn()
    };

    const mockLocation = new URL("https://forms.pythondiscord.com/authorize?code=abcdef");

    Object.defineProperty(global, "location", {value: mockLocation});

    const comp = <CallbackPage />;

    const { getByText } = render(comp);


    const codeText = getByText(/Code is abcdef/);
    expect(codeText).toBeInTheDocument();
    expect(global.opener.postMessage).toBeCalledTimes(1);
});
