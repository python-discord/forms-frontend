export interface Form {
    name: string,
    description: string,
    open: boolean
}

export function getForms(): Form[] {
    return [
        {
            name: "Ban Appeals",
            description: "Appealing bans from the Discord server",
            open: true
        },
        {
            name: "Insights 2020",
            description: "Insights about the Python Discord community",
            open: false
        },
        {
            name: "Code Jam 2099 Sign Ups",
            description: "Signing up for Python Discord's millionth code jam!",
            open: false
        }
    ]
}
