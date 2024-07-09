import React from "react";
import {act, waitFor} from "@testing-library/react";
import { renderWithProviders } from "./utils";

import App from "../App";

test("renders app to body", async () => {
    await act(async () => {
        const {container} = renderWithProviders(<App/>);
        await waitFor(() => {
            expect(container).toBeInTheDocument();
        });
    });
});
