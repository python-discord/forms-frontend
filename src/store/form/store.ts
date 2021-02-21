import { createStore } from "redux";
import { formReducer } from "./reducers";

export const store = createStore(formReducer);
