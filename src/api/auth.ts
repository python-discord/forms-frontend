import Cookies, { CookieSetOptions } from "universal-cookie";
import { AxiosResponse } from "axios";

import APIClient from "./client";

const OAUTH2_CLIENT_ID = process.env.REACT_APP_OAUTH2_CLIENT_ID;
const PRODUCTION = process.env.NODE_ENV !== "development";

/**
 * Authorization result as returned from the backend.
 */
interface AuthResult {
    token: string,
    expiry: string
}

interface JWTResponse {
    JWT: string,
    Expiry: Date
}

/**
 * Name properties for authorization cookies.
 */
enum CookieNames {
    Scopes = "DiscordOAuthScopes",
    Token = "FormBackendToken"
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
export function checkScopes(scopes?: OAuthScopes[], path = ""): boolean {
    const cleanedScopes = ensureMinimumScopes(scopes, OAuthScopes.Identify);

    // Get Active Scopes And Ensure Type
    const cookies = new Cookies().get(CookieNames.Scopes + path);
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
 * If disable function is passed, the component will be disabled while the login is ongoing.
 *
 * @returns {code, cleanedScopes} The discord authorization code and the scopes the code is granted for.
 * @throws {Error} Indicates that an integrity check failed.
 */
export async function getDiscordCode(scopes: OAuthScopes[], disableFunction?: (newState: boolean) => void): Promise<{code: string, cleanedScopes: OAuthScopes[]}> {
    const cleanedScopes = ensureMinimumScopes(scopes, OAuthScopes.Identify);
    const disable = (newState: boolean) => { if (disableFunction) disableFunction(newState); };

    disable(true);

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
            disable(false);
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
                disable(false);

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
 * Sends a discord code from a given path to the backend,
 * and returns the resultant JWT and expiry date.
 */
export async function requestBackendJWT(code: string): Promise<JWTResponse> {
    const result = await APIClient.post("/auth/authorize", {token: code})
        .catch(reason => { throw reason; }) // TODO: Show some sort of authentication failure here
        .then((response: AxiosResponse<AuthResult>) => {
            const _expiry = new Date();
            _expiry.setTime(Date.parse(response.data.expiry));

            return {JWT: response.data.token, Expiry: _expiry};
        });

    if (!result.JWT || !result.Expiry) {
        throw Error("Could not fetch OAuth code.");
    }

    return result;
}

/**
 * Handle a full authorization flow. Sets a token for the specified path with the JWT and scopes.
 *
 * @param scopes The scopes that should be authorized for the application.
 * @param disableFunction An optional function that can disable a component while processing.
 * @param path The site path to save the token under.
 */
export default function authorize(scopes?: OAuthScopes[], disableFunction?: (newState: boolean) => void, path = "/"): void {
    if (!checkScopes(scopes, path)) {
        const cookies = new Cookies;
        cookies.remove(CookieNames.Token + path);
        cookies.remove(CookieNames.Scopes + path);

        getDiscordCode(scopes || [], disableFunction).then(discord_response =>{
            requestBackendJWT(discord_response.code).then(backend_response => {
                const options: CookieSetOptions = {sameSite: "strict", expires: backend_response.Expiry, secure: PRODUCTION, path: path};

                cookies.set(CookieNames.Token + path, backend_response.JWT, options);
                cookies.set(CookieNames.Scopes + path, discord_response.cleanedScopes, options);
            });
        });
    }
}
