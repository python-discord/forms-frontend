/** @jsx jsx */
/** @global location */
import { jsx, Global } from "@emotion/core";

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import { CSSTransition, TransitionGroup } from "react-transition-group";

import LandingPage from "./pages/LandingPage";
import FormPage from "./pages/FormPage";

import globalStyles from "./globalStyles";

const routes = [
  { path: "/", Component: LandingPage },
  { path: "/form/:id", Component: FormPage}
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
                  <Route key={path} exact path={path} component={Component}/>
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
