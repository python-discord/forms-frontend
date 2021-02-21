import {Action, FormAction} from "./actions";
import {FormState} from "./types";

export const initialState: FormState = {
    values: new Map(),
    errors: new Map(),
    valid: new Map()
};

export function formReducer(state = initialState, action: Action): FormState {
    const new_state = state;
    switch (action.type) {
        case FormAction.SET_VALUE:
            new_state.values.set(action.payload.question.id, action.payload.value);
            break;

        case FormAction.SET_ERROR:
            new_state.errors.set(action.payload.question.id, action.payload.error);
            break;

        case FormAction.SET_VALID:
            new_state.valid.set(action.payload.question.id, action.payload.valid);
            break;

        case FormAction.CLEAN:
            return initialState;
    }
    return new_state;
}
