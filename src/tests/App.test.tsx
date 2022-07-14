import React from "react";
import {act, render, waitFor} from "@testing-library/react";

import App from "../App";

test("renders app to body", async () => {
    await act(async () => {
        const {container} = render(<App/>);
        await waitFor(() => {
            expect(container).toBeInTheDocument();
        });
    });
});
