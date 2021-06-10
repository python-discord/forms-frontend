/** @jsx jsx */
/** @global location */
import React, { Suspense } from "react";
import { jsx, css, Global } from "@emotion/react";
import { Helmet } from "react-helmet";

import {
    BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom";

import { PropagateLoader } from "react-spinners";

import { CSSTransition, TransitionGroup } from "react-transition-group";

import globalStyles from "./globalStyles";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const FormPage = React.lazy(() => import("./pages/FormPage"));
const CallbackPage = React.lazy(() => import("./pages/CallbackPage"));

const routes = [
    { path: "/", Component: LandingPage },
    { path: "/form/:id", Component: FormPage},
    { path: "/callback", Component: CallbackPage }
];

function PageLoading() {
    return <div css={css`
    display: flex;
    justify-content: center;
    margin-top: 50px;
  `}>
        <PropagateLoader color="white" size={100}/>
    </div>;
}

function App(): JSX.Element {
    return (
        <div>
            <Helmet>
                <meta name="description" content="Python Discord Forms is the surveying system for the Python Discord server."/>
            </Helmet>

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
                                        <Suspense fallback={<PageLoading/>}>
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
}

export default App;
