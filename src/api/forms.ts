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
    webhook: WebHook | null,
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
    const data: Array<Form> = Array.from(resp.data);
    data.push({ description: "", features: [], name: "Demo", questions: [], webhook: null, id: "demo" });
    return data; // FIXME: Revert this
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
                    id: "section",
                    name: "This is a section",
                    type: QuestionType.Section,
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
                },{
                    id: "section-with-byline",
                    name: "This is a section with an optional byline",
                    type: QuestionType.Section,
                    data: {
                        "text": "How come 'hello world' became the de facto beginner print statement, instead of something like \"test\" or \"here\"?"
                    }
                }, {
                    id: "radio",
                    name: "This is a radio",
                    type: QuestionType.Radio,
                    data: {
                        options: [
                            "Option 1",
                            "Option 2",
                            "Option 3",
                            "Option 1",
                            "Yes option one is repeated twice, I do it to prevent the usage of values as keys or any other weird practices like that. This was a really long option to test text wrapping."
                        ]
                    }
                }, {
                    id: "code",
                    name: "This is code (skipped for now)",
                    type: QuestionType.Code,
                    data: {}
                }, {
                    id: "select",
                    name: "This is a select",
                    type: QuestionType.Select,
                    data: {
                        options: [
                            "Option 1",
                            "Option 2",
                            "Option 3",
                            "Option 1",
                            "Yes option one is repeated twice, I do it to prevent the usage of values as keys or any other weird practices like that. This was a really long option to test text wrapping."
                        ]
                    }
                }
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
