import Cookies, { CookieSetOptions } from "universal-cookie";
import { AxiosResponse } from "axios";

import APIClient from "./client";

const OAUTH2_CLIENT_ID = process.env.REACT_APP_OAUTH2_CLIENT_ID;
const PRODUCTION = process.env.NODE_ENV !== "development";

/**
 * Authorization result as returned from the backend.
 */
interface AuthResult {
    username: string,
    expiry: string
}

/**
 * Name properties for authorization cookies.
 */
enum CookieNames {
    Scopes = "DiscordOAuthScopes",
    Username = "DiscordUsername"
}

export interface APIErrors {
    Message: APIErrorMessages,
    Error: any, /* eslint-disable-line @typescript-eslint/no-explicit-any */
}

export enum APIErrorMessages {
    BackendValidation = "Backend could not authorize with Discord. Please contact the forms team.",
    BackendValidationDev = "Backend could not authorize with Discord, possibly due to being on a preview branch. Please contact the forms team.",
    BackendUnresponsive = "Unable to reach the backend, please retry, or contact the forms team.",
    BadResponse = "The server returned a bad response, please contact the forms team.",
    Unknown = "An unknown error occurred, please contact the forms team."
}

/**
 * [Reference]{@link https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes}
 *
 * Commented out enums are locked behind whitelists.
 */
export enum OAuthScopes {
    Bot = "bot",
    Connections = "connections",
    Email = "email",
    Identify = "identify",
    Guilds = "guilds",
    GuildsJoin = "guilds.join",
    GDMJoin = "gdm.join",
    MessagesRead = "messages.read",
    // RPC = "rpc",
    // RPC_API = "rpc.api",
    // RPCNotifRead = "rpc.notifications.read",
    WebhookIncoming = "webhook.incoming",
    // AppsBuildsUpload = "applications.builds.upload",
    AppsBuildsRead = "applications.builds.read",
    AppsStoreUpdate = "applications.store.update",
    AppsEntitlements = "applications.entitlements",
    // RelationshipsRead = "relationships.read",
    // ActivitiesRead = "activities.read",
    // ActivitiesWrite = "activities.write",
    AppsCommands = "applications.commands",
    AppsCommandsUpdate = "applications.commands.update"
}

/**
 * Helper method to ensure the minimum required scopes
 * for the application to function exist in a list.
 */
function ensureMinimumScopes(scopes: unknown, expected: OAuthScopes | OAuthScopes[]): OAuthScopes[] {
    let result: OAuthScopes[] = [];
    if (scopes && Array.isArray(scopes)) {
        result = scopes;
    }

    if (Array.isArray(expected)) {
        expected.forEach(scope => { if (!result.includes(scope)) result.push(scope); });
    } else {
        if (!result.includes(expected)) result.push(expected);
    }

    return result;
}

/**
 * Return true if the program has the requested scopes or higher.
 */
export function checkScopes(scopes?: OAuthScopes[]): boolean {
    const cleanedScopes = ensureMinimumScopes(scopes, OAuthScopes.Identify);

    // Get Active Scopes And Ensure Type
    const cookies = new Cookies().get(CookieNames.Scopes);
    if (!cookies || !Array.isArray(cookies)) {
        return false;
    }

    // Check For Scope Existence
    for (const scope of cleanedScopes) {
        if (!cookies.includes(scope)) {
            return false;
        }
    }

    return true;
}

/***
 * Request authorization code from the discord api with the provided scopes.
 *
 * @returns {code, cleanedScopes} The discord authorization code and the scopes the code is granted for.
 * @throws {Error} Indicates that an integrity check failed.
 */
export async function getDiscordCode(scopes: OAuthScopes[]): Promise<{code: string, cleanedScopes: OAuthScopes[]}> {
    const cleanedScopes = ensureMinimumScopes(scopes, OAuthScopes.Identify);

    // Generate a new user state
    const state = crypto.getRandomValues(new Uint32Array(1))[0];

    const scopeString = encodeURIComponent(cleanedScopes.join(" "));
    const redirectURI = encodeURIComponent(document.location.protocol + "//" + document.location.host + "/callback");

    // Open login window
    const windowRef = window.open(
        `https://discord.com/api/oauth2/authorize?client_id=${OAUTH2_CLIENT_ID}&state=${state}&response_type=code&scope=${scopeString}&redirect_uri=${redirectURI}&prompt=none`,
        "Discord_OAuth2",
        "height=700,width=500,location=no,menubar=no,resizable=no,status=no,titlebar=no,left=300,top=300"
    );

    // Clean up on login
    const interval = setInterval(() => {
        if (windowRef?.closed) {
            clearInterval(interval);
        }
    }, 500);

    // Handle response
    const code = await new Promise<string>(resolve => {
        window.onmessage = (message: MessageEvent) => {
            if (message.data.source) {
                // React DevTools has a habit of sending messages, ignore them.
                return;
            }

            if (message.isTrusted) {
                windowRef?.close();

                clearInterval(interval);

                // State integrity check
                if (message.data.state !== state.toString()) {
                    // This indicates a lack of integrity
                    throw Error("Integrity check failed.");
                }

                // Remove handler
                window.onmessage = null;
                resolve(message.data.code);
            }
        };
    });

    return {code: code, cleanedScopes: cleanedScopes};
}

/**
 * Sends a discord code to the backend, which sets an authentication JWT
 * and returns the Discord username.
 *
 * @throws { APIErrors } On error, the APIErrors.Message is set, and an APIErrors object is thrown.
 */
export async function requestBackendJWT(code: string): Promise<{username: string, maxAge: number}> {
    const reason: APIErrors = { Message: APIErrorMessages.Unknown, Error: null };
    let result;

    try {
        result = await APIClient.post("/auth/authorize", {token: code})
            .catch(error => {
                reason.Error = error;

                if (error.response) {
                    // API Responded with a non-2xx Response
                    if (error.response.status === 400) {
                        reason.Message = process.env.CONTEXT === "deploy-preview" ? APIErrorMessages.BackendValidationDev : APIErrorMessages.BackendValidation;
                    }
                } else if (error.request) {
                    // API did not respond
                    reason.Message = APIErrorMessages.BackendUnresponsive;
                }

                throw error;

            }).then((response: AxiosResponse<AuthResult>) => {
                const expiry = Date.parse(response.data.expiry);
                return {username: response.data.username, maxAge: (expiry - Date.now()) / 1000};
            });
    } catch (e) {
        if (reason.Error === null) {
            reason.Error = e;
        }

        throw reason;
    }

    if (!result || !result.username || !result.maxAge) {
        reason.Message = APIErrorMessages.BadResponse;
        throw reason;
    }

    return result;
}

/**
 * Refresh the backend authentication JWT. Returns the success of the operation, and silently handles denied requests.
 */
export async function refreshBackendJWT(): Promise<boolean> {
    const cookies = new Cookies();

    let pass = true;
    APIClient.post("/auth/refresh").then((response: AxiosResponse<AuthResult>) => {
        cookies.set(CookieNames.Username, response.data.username, {sameSite: "strict", secure: PRODUCTION, path: "/", expires: new Date(3000, 1)});

        const expiry = Date.parse(response.data.expiry);
        setTimeout(refreshBackendJWT, (expiry * 0.9));
    }).catch(() => {
        pass = false;
        cookies.remove(CookieNames.Scopes);
    });

    return new Promise(resolve => resolve(pass));
}

/**
 * Handle a full authorization flow. Sets a cookie with the JWT and scopes.
 *
 * @param scopes The scopes that should be authorized for the application.
 * @param disableFunction An optional function that can disable a component while processing.
 * @param refresh If true, the token refresh will be scehduled automatically
 *
 * @throws { APIErrors } See documentation on { requestBackendJWT }.
 */
export default async function authorize(scopes: OAuthScopes[] = [], disableFunction?: (newState: boolean) => void, refresh = true): Promise<void> {
    if (checkScopes(scopes)) {
        return;
    }

    const cookies = new Cookies;
    cookies.remove(CookieNames.Scopes);

    if (disableFunction) { disableFunction(true); }
    await getDiscordCode(scopes).then(async discord_response =>{
        await requestBackendJWT(discord_response.code).then(backend_response => {
            const options: CookieSetOptions = {sameSite: "strict", secure: PRODUCTION, path: "/", expires: new Date(3000, 1)};
            cookies.set(CookieNames.Username, backend_response.username, options);

            options.maxAge = backend_response.maxAge;
            cookies.set(CookieNames.Scopes, discord_response.cleanedScopes, options);

            if (refresh) {
                // Schedule refresh after 90% of it's age
                setTimeout(refreshBackendJWT, (backend_response.maxAge * 0.9) * 1000);
            }
        });
    }).finally(() => {
        if (disableFunction) { disableFunction(false); }
    });


    return new Promise<void>(resolve => resolve());
}
