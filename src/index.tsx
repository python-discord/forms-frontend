import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import colors from "./colors";

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
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
