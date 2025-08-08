import { Question } from "./question";
import ApiClient from "./client";

export enum FormFeatures {
    Discoverable = "DISCOVERABLE",
    RequiresLogin = "REQUIRES_LOGIN",
    Open = "OPEN",
    CollectEmail = "COLLECT_EMAIL",
    DisableAntispam = "DISABLE_ANTISPAM",
    WebhookEnabled = "WEBHOOK_ENABLED"
}

export interface Form {
    id: string,
    features: Array<FormFeatures>,
    webhook: WebHook | null,
    questions: Array<Question>,
    name: string,
    description: string,
    submitted_text: string | null
}

export interface Precheck {
    severity: "warning" | "danger" | "secondary",
    message: string
}

export interface SubmissionPrecheck {
    can_submit: boolean,
    problems: Array<Precheck>
}

export interface FormWithAncillaryData extends Form {
    submission_precheck: SubmissionPrecheck
}

export interface WebHook {
    url: string,
    message: string | null
}

export async function getForms(): Promise<Form[]> {
    const fetch_response = await ApiClient.get("forms/discoverable");
    return fetch_response.data;
}

export async function getForm(id: string): Promise<FormWithAncillaryData> {
    const fetch_response = await ApiClient.get(`forms/${id}`);
    return fetch_response.data;
}
