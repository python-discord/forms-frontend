/** @jsx jsx */
/** @global location */
import React, { Suspense } from "react";
import { jsx, css, Global } from "@emotion/react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { PropagateLoader } from "react-spinners";

import { CSSTransition, TransitionGroup } from "react-transition-group";

import globalStyles from "./globalStyles";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const FormPage = React.lazy(() => import("./pages/FormPage/FormPage"));
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

function Routing(): JSX.Element {
    const renderedRoutes = routes.map(({path, Component}) => (
        <Route key={path} path={path} element={
            <Suspense fallback={<PageLoading/>}><Component/></Suspense>
        }/>
    ));

    return (
        <Routes location={location}>
            {renderedRoutes}
        </Routes>
    );
}

function App(): JSX.Element {
    return (
        <div>
            <Global styles={globalStyles}/>
            <TransitionGroup>
                <CSSTransition key={location.pathname} classNames="fade" timeout={300}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="*" element={<Routing/>}/>
                        </Routes>
                    </BrowserRouter>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
}

export default App;
