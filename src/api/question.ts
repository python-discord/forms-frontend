export enum QuestionType {
    TextArea = "textarea",
    Checkbox = "checkbox",
    Radio = "radio",
    Code = "code",
    Select = "select",
    ShortText = "short_text",
    Range = "range",
    Section = "section"
}

export interface Question {
    id: string,
    name: string,
    type: QuestionType,
    data: { [key: string]: string | string[] },
    required: boolean
}

type unittestError = {
    question_id: string,
    question_index: number,
    return_code: number,
    passed: boolean,
    result: string,
}

export interface UnittestFailure {
    error: string,
    test_results: unittestError[],
}
