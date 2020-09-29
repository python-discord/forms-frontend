/** @jsx jsx */
/** @global location */
import { css, jsx, Global } from "@emotion/core";

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import { CSSTransition, TransitionGroup } from "react-transition-group";

import LandingPage from "./pages/LandingPage";
import colors from "./colors";
import FormPage from "./pages/FormPage";

const globalStyles = css`
@import url('https://fonts.googleapis.com/css2?family=Hind:wght@700&display=swap');

@font-face {
  font-family: 'Uni Sans';
  src: url(fonts/unisans.otf) format('opentype');
}

body {
  background-color: ${colors.notQuiteBlack};
  color: white;
  font-family: "Hind", "Helvetica", "Arial", sans-serif;
  margin: 0;
}

.fade-enter,
.fade-exit {
  position: absolute;
  top: 0;
  left: 0;
  transition: 300ms ease opacity;
  width: 100%;
}

.fade-enter,
.fade-exit-active {
  opacity: 0;
}

.fade-enter-active {
  opacity: 1;
  z-index: 1;
}
`;

const routes = [
  { path: "/", Component: LandingPage },
  { path: "/form", Component: FormPage}
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
                  <Route exact path={path} component={Component}/>
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
