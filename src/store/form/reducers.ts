import {Action, FormAction} from "./actions";
import {FormState} from "./types";

export const initialState: FormState = {
    values: {},
    errors: {},
    valid: {},
    captchaToken: null
};

export function formReducer(state = initialState, action: Action): FormState {
    switch (action.type) {
        case FormAction.SET_VALUE:
            return {
                ...state,
                values: {
                    ...state.values,
                    [action.payload.question.id]: action.payload.value
                }
            };

        case FormAction.SET_ERROR:
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.payload.question.id]: action.payload.error
                }
            };

        case FormAction.SET_VALID:
            return {
                ...state,
                valid: {
                    ...state.valid,
                    [action.payload.question.id]: action.payload.valid
                }
            };

        case FormAction.CLEAN:
            return initialState;

        case FormAction.SET_CAPTCHA_TOKEN:
            return {
                ...state,
                captchaToken: action.payload
            };
    }
    return {...state};
}
