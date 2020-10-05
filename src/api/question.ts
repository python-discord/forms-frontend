export enum QuestionType {
    Text,
    Checkbox,
    Radio,
    Code
}

export interface Question {
    name: string,
    type: QuestionType
}
