import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authorizationReducer from "./slices/authorization";

const rootReducer = combineReducers({
    authorization: authorizationReducer
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState
    });
};

const formsStore = setupStore();

export default formsStore;

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
