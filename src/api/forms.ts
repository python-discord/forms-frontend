import { Question, QuestionType } from "./question"

export enum FormFeatures {
    Discoverable = "DISCOVERABLE",
    RequiresLogin = "REQUIRES_LOGIN",
    Open = "OPEN",
    CollectEmail = "COLLECT_EMAIL",
    DisableAntispam = "DISABLE_ANTISPAM"
}

export interface Form {
    id: string,
    features: Array<FormFeatures>,
    questions: Array<Question>,
    name: string,
    description: string
}

export function getForms(): Form[] {
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
        name: "Ban Appeals",
        id: "ban-appeals",
        description: "Appealing bans from the Discord server",
        features: [FormFeatures.Discoverable, FormFeatures.Open],
        questions: [
            {
                id: "how-spanish-are-you",
                name: "How Spanish are you?",
                type: QuestionType.ShortText,
                data: {}
            }
        ]
    }
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1500)
    })
} 
