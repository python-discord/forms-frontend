/** @jsx jsx */
/** @global location */
import React, { Suspense } from "react";
import { jsx, css, Global } from "@emotion/react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { PropagateLoader } from "react-spinners";

import AuthorizationSplash from "./components/AuthorizationSplash";

import { CSSTransition, TransitionGroup } from "react-transition-group";

import Logo from "./images/logo.svg";

import globalStyles from "./globalStyles";
import NotFound from "./pages/NotFound";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const FormPage = React.lazy(() => import("./pages/FormPage/FormPage"));
const CallbackPage = React.lazy(() => import("./pages/CallbackPage"));

const routes = [
    { path: "/", Component: LandingPage },
    { path: "/form/:id", Component: FormPage},
    { path: "/callback", Component: CallbackPage }
];

const pageLoadingStyles = css`
display: flex;
justify-content: center;
margin-top: 10%;
align-items: center;
flex-direction: column;

svg {
  transform: scale(0.35);
}
`;

function PageLoading() {
    return <div css={pageLoadingStyles}>
        <Logo/>
        <PropagateLoader color="white"/>
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
            <Route path="*" element={<NotFound message={"404: This page does not exist"}/>}/>
        </Routes>
    );
}

function App(): JSX.Element {
    return (
        <div>
            <Global styles={globalStyles}/>
            <AuthorizationSplash/>
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
