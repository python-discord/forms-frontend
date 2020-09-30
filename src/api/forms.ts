export interface Form {
    title: string,
    description: string,
    open: boolean
}

export function getForms(): Form[] {
    return [
        {
            title: "Ban Appeals",
            description: "Appealing bans from the Discord server",
            open: true
        },
        {
            title: "Insights 2020",
            description: "Insights about the Python Discord community",
            open: false
        },
        {
            title: "Code Jam 2099 Sign Ups",
            description: "Signing up for Python Discord's millionth code jam!",
            open: false
        }
    ]
}
