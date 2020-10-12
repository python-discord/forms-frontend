import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import colors from "./colors";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      new Integrations.BrowserTracing(),
    ],
    tracesSampleRate: 0.25,
    release: `forms-frontend@${process.env.REACT_APP_SHA}`
  });
}

console.log("%c  Python Discord Forms  ", `font-size: 6em; font-family: "Hind", "Arial"; font-weight: 900; background-color: ${colors.blurple}; border-radius: 10px;`)
console.log("%cWelcome to Python Discord Forms", `font-size: 3em; font-family: "Hind", "Arial";`)

console.log(`   Environment: %c ${process.env.NODE_ENV} `, `padding: 2px; border-radius: 5px; background-color: ${process.env.NODE_ENV === "production" ? colors.success : colors.error}`)
console.log(`   Location: %c ${document.location.pathname + document.location.search + document.location.hash} `, `padding: 2px; border-radius: 5px; background-color: ${colors.success}`)
console.log(`   User Agent: %c ${navigator.userAgent} `, `padding: 2px; border-radius: 5px; background-color: ${colors.success}`)
console.log(`   Branch: %c ${process.env.REACT_APP_BRANCH} `, `padding: 2px; border-radius: 5px; background-color: ${process.env.REACT_APP_BRANCH === "main" ? colors.success : colors.error}`)
console.log(`   SHA: %c ${process.env.REACT_APP_SHA} `, `padding: 2px; border-radius: 5px; background-color: ${colors.success}`)

console.log("%cCome join us on Discord! https://discord.gg/python", `font-size: 1.5em; font-family: "Hind", "Arial"; color: ${colors.blurple}`)

ReactDOM.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={<p>An error has occurred with Python Discord Forms. Please let us know in the Discord server at <a href="https://discord.gg/python">discord.gg/python</a></p>}
      showDialog={true}
      dialogOptions={{
        title: "You've found a bug in PyDis forms!"
      }}
      onError={(err) => {
        if(process.env.NODE_ENV === "development")
          console.log(err)
      }}
    >
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
