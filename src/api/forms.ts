import { Question, QuestionType } from "./question";
import ApiClient from "./client";

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

export async function getForms(): Promise<Form[]> {
    const resp = await ApiClient.get("forms/discoverable");
    return resp.data;
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
    };
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1500);
    });
} 
