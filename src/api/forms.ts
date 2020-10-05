import { Question, QuestionType } from "./question"

export interface AllFormsForm {
    title: string,
    id: string,
    description: string,
    open: boolean
}

export interface Form extends AllFormsForm {
    questions: Array<Question>
}

export function getForms(): AllFormsForm[] {
    return [
        {
            title: "Ban Appeals",
            id: "ban-appeals",
            description: "Appealing bans from the Discord server",
            open: true
        },
        {
            title: "Insights 2020",
            id: "insights-2020",
            description: "Insights about the Python Discord community",
            open: false
        },
        {
            title: "Code Jam 2099 Sign Ups",
            id: "code-jam-2099-sign-up",
            description: "Signing up for Python Discord's millionth code jam!",
            open: false
        }
    ]
}

export function getForm(id: string): Promise<Form> {
    const data: Form = {
        title: "Ban Appeals",
        id: "ban-appeals",
        description: "Appealing bans from the Discord server",
        open: true,
        questions: [
            {
                name: "How Spanish are you?",
                type: QuestionType.Text
            }
        ]
    }
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1500)
    })
} 
