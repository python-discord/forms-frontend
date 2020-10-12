/** @jsx jsx */
/** @global location */
import React, { Suspense } from "react";
import { jsx, Global } from "@emotion/core";

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import { HashLoader } from "react-spinners";

import { CSSTransition, TransitionGroup } from "react-transition-group";

import globalStyles from "./globalStyles";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const FormPage = React.lazy(() => import("./pages/FormPage"));
const CallbackPage = React.lazy(() => import("./pages/CallbackPage"));

const routes = [
  { path: "/", Component: LandingPage },
  { path: "/form/:id", Component: FormPage},
  { path: "/callback", Component: CallbackPage }
]

function App() {
  return (
    <div>
      <Global styles={globalStyles}/>
      <Router>
        <Route render={({ location }) => (
          <TransitionGroup>
            <CSSTransition
              key={location.pathname}
              classNames="fade"
              timeout={300}
            >
              <Switch location={location}>
                {routes.map(({path, Component}) => (
                  <Route exact key={path} path={path}>
                    <Suspense fallback={<HashLoader color="white"/>}>
                      <Component/>
                    </Suspense>
                  </Route>
                ))}
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )}/>
      </Router>
    </div>
  );
};

export default App;
