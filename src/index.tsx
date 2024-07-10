/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import formsStore from "./store";
import { Provider } from "react-redux";

import * as Sentry from "@sentry/react";

import {
    createRoutesFromChildren,
    matchRoutes,
    useLocation,
    useNavigationType,
} from "react-router-dom";


import colors from "./colors";

if (process.env.NODE_ENV === "production") {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        tracesSampleRate: 0.5,
        release: `forms-frontend@${process.env.COMMIT_REF}`,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        environment: process.env.CONTEXT,
        integrations: [
            Sentry.reactRouterV6BrowserTracingIntegration({
                useEffect,
                useLocation,
                useNavigationType,
                createRoutesFromChildren,
                matchRoutes,
            }),
            Sentry.replayIntegration(),
        ]
    });

    // Set tag as PR number, "main", or if unavailable, "unknown"
    const branch = process.env.BRANCH ?? "unknown";
    const branch_name = branch.replace(RegExp("pull/|/head", "g"), "");
    Sentry.setTag(branch_name === "main" ? "branch" : "pull_request", branch_name);
}

console.log("%c  Python Discord Forms  ", `font-size: 4em; font-family: "Hind", "Arial"; font-weight: 900; background-color: ${colors.blurple}; border-radius: 10px;`);
console.log("%cWelcome to Python Discord Forms", "font-size: 3em; font-family: \"Hind\", \"Arial\";");

console.log(`   Environment: %c ${process.env.NODE_ENV} `, `padding: 2px; border-radius: 5px; background-color: ${process.env.NODE_ENV === "production" ? colors.success : colors.error}`);
console.log(`   Context: %c ${process.env.CONTEXT} `, `padding: 2px; border-radius: 5px; background-color: ${process.env.CONTEXT === "production" ? colors.success : colors.error}`);
console.log(`   Location: %c ${document.location.pathname + document.location.search + document.location.hash} `, `padding: 2px; border-radius: 5px; background-color: ${colors.success}`);
console.log(`   User Agent: %c ${navigator.userAgent} `, `padding: 2px; border-radius: 5px; background-color: ${colors.success}`);
console.log(`   Branch: %c ${process.env.BRANCH} `, `padding: 2px; border-radius: 5px; background-color: ${process.env.BRANCH === "main" ? colors.success : colors.error}`);
console.log(`   SHA: %c ${process.env.COMMIT_REF} `, `padding: 2px; border-radius: 5px; background-color: ${colors.success}`);

console.log("%cCome join us on Discord! https://discord.gg/python", `font-size: 1.5em; font-family: "Hind", "Arial"; color: ${colors.blurple}`);

const rootDocument = document.getElementById("root");

const root = createRoot(rootDocument!);
root.render(
    <React.StrictMode>
        <Sentry.ErrorBoundary
            fallback={<p>An error has occurred with Python Discord Forms. Please let us know in the Discord server at <a href="https://discord.gg/python">discord.gg/python</a></p>}
            showDialog={true}
            dialogOptions={{
                title: "You've found a bug in PyDis forms!"
            }}
            onError={(err) => {
                if(process.env.NODE_ENV === "development")
                    console.log(err);
            }}
        >
            <Provider store={formsStore}>
                <App/>
            </Provider>
        </Sentry.ErrorBoundary>
    </React.StrictMode>
);

serviceWorker.unregister();
