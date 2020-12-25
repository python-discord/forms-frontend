import { Question, QuestionType } from "./question"
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
    let data: Form;
    if (id === "demo") {
        data = {
            name: "Ban Appeals",
            id: "ban-appeals",
            description: "Appealing bans from the Discord server",
            features: [FormFeatures.Discoverable, FormFeatures.Open],
            questions: [
                {
                    id: "short-text",
                    name: "This is short text",
                    type: QuestionType.ShortText,
                    data: {}
                }, {
                    id: "check-box-thing",
                    name: "This is a checkbox",
                    type: QuestionType.Checkbox,
                    data: {
                        "options": [
                            "United Kingdom",
                            "United Kingdom",
                            "United States",
                            "Other Country That Starts With United",
                        ]
                    }
                }, {
                    id: "range",
                    name: "This is a range",
                    type: QuestionType.Range,
                    data: {
                        "options": [
                            "A", "B", "C"
                        ]
                    }
                }, {
                    id: "textarea",
                    name: "This is a textarea",
                    type: QuestionType.TextArea,
                    data: {}
                }, {
                    id: "radio",
                    name: "This is a radio",
                    type: QuestionType.Radio,
                    data: {}
                }, {
                    id: "code",
                    name: "This is code (skipped for now)",
                    type: QuestionType.Code,
                    data: {}
                }, {
                    id: "select",
                    name: "This is a select",
                    type: QuestionType.Select,
                    data: {}
                }, {
                    id: "section",
                    name: "This is a section",
                    type: QuestionType.Section,
                    data: {}
                },
            ],
            webhook: {
                url: "",
                message: null
            },
        }
    } else {
        const fetch_response = await ApiClient.get(`forms/${id}`);
        data = fetch_response.data;
    }

    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 0)
    })
} 
