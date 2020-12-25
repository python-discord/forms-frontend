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
    data: { [key: string]: any }
}
