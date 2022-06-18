import React from "react";
import { render, waitFor } from "@testing-library/react";

import CallbackPage from "../../pages/CallbackPage";

test("callback page sends provided code", async () => {
    global.opener = {
        postMessage: jest.fn()
    };

    const mockLocation = new URL("https://forms.pythondiscord.com/authorize?code=abcde_code&state=abcde_state");

    Object.defineProperty(global, "location", {value: mockLocation});

    render(<CallbackPage/>);

    await waitFor(() => {
        expect(global.opener.postMessage).toBeCalledTimes(1);
        expect(global.opener.postMessage).toBeCalledWith({
            code: "abcde_code",
            state: "abcde_state"
        });
    });
});
