import { createSlice } from "@reduxjs/toolkit";

const authorizationSlice = createSlice({
    name: "authorization",
    initialState: {
        authorizing: false,
    },
    reducers: {
        startAuthorizing: (state) => {
            state.authorizing = true;
        },
        finishAuthorizing: (state) => {
            state.authorizing = false;
        },
    },
});

export const { startAuthorizing, finishAuthorizing } = authorizationSlice.actions;

export default authorizationSlice.reducer;
