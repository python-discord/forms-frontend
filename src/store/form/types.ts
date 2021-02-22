export interface FormState {
    values: { [key: string]: string | { [subKey: string]: boolean } | null },
    errors: { [key: string]: string },
    valid: { [key: string]: boolean },
    captchaToken: string | null
}
