export interface FormState {
    values: Map<string, string | Map<string, boolean> | null>,
    errors: Map<string, string>,
    valid: Map<string, boolean>
}
