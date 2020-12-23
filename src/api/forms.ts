import {Question, QuestionType} from "./question"
import ApiClient from "./client";

export enum FormFeatures {
    Discoverable = "DISCOVERABLE",
    RequiresLogin = "REQUIRES_LOGIN",
    Open = "OPEN",
    CollectEmail = "COLLECT_EMAIL",
    DisableAntispam = "DISABLE_ANTISPAM",
    WEBHOOK_ENABLED = "WEBHOOK_ENABLED"
}

export interface Form {
    id: string,
    features: Array<FormFeatures>,
    webhook: WebHook,
    questions: Array<Question>,
    name: string,
    description: string
}

export interface WebHook {
    url: string,
    message: string | null
}

export async function getForms(): Promise<Form[]> {
    const resp = await ApiClient.get("forms/discoverable");
    return resp.data;
}

export async function getForm(id: string): Promise<Form> {
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
            },
            {
                id: "check-box-thing",
                name: "Enter what you want",
                type: QuestionType.Checkbox,
                data: {
                    "options": [
                        "United Kingdom",
                        "United States"
                    ]
                }
            },
            {
                id: "range",
                name: "This is a range",
                type: QuestionType.Range,
                data: {
                    "options": {

                    }
                }
            }
        ],
        webhook: {
            url: "",
            message: null
        },
    }
    // const fetch_response = await ApiClient.get(`forms/${id}`);
    // const data: Form = fetch_response.data;

    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 0)
    })
} 
