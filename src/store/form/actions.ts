import { Question } from "../../api/question";

// All Redux actions that can be triggered
export enum FormAction {
    SET_VALUE = "SET_VALUE",
    SET_ERROR = "SET_ERROR",
    SET_VALID = "SET_VALID",
    CLEAN = "CLEAN",
    SET_CAPTCHA_TOKEN = "SET_CAPTCHA_TOKEN"
}

// This is base for all actions
export interface DefaultFormAction {
    type: FormAction
}

// Return values for actions
export interface SetValueAction extends DefaultFormAction {
    type: FormAction.SET_VALUE,
    payload: {
        question: Question,
        value: string | Map<string, boolean> | null
    }
}

export interface SetErrorAction extends DefaultFormAction {
    type: FormAction.SET_ERROR,
    payload: {
        question: Question,
        error: string
    }
}

export interface SetValidAction extends DefaultFormAction {
    type: FormAction.SET_VALID,
    payload: {
        question: Question,
        valid: boolean
    }
}

export interface CleanAction extends DefaultFormAction {
    type: FormAction.CLEAN
}

export interface SetCaptchaTokenAction extends DefaultFormAction {
    type: FormAction.SET_CAPTCHA_TOKEN,
    payload: string | null
}

export type Action = SetValueAction | SetErrorAction | SetValidAction | CleanAction | SetCaptchaTokenAction;

export function setValue(question: Question, value: string | Map<string, boolean> | null): SetValueAction {
    return {
        type: FormAction.SET_VALUE,
        payload: {
            question: question,
            value: value
        }
    };
}

export function setError(question: Question, error: string): SetErrorAction {
    return {
        type: FormAction.SET_ERROR,
        payload: {
            question: question,
            error: error
        }
    };
}

export function setValid(question: Question, valid: boolean): SetValidAction {
    return {
        type: FormAction.SET_VALID,
        payload: {
            question: question,
            valid: valid
        }
    };
}

export function clean(): CleanAction {
    return { type: FormAction.CLEAN };
}

export function setCaptchaToken(token: string | null): SetCaptchaTokenAction {
    return { type: FormAction.SET_CAPTCHA_TOKEN, payload: token };
}
