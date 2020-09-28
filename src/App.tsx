/** @jsx jsx */
import { css, jsx, Global } from "@emotion/core";

import LandingPage from "./pages/LandingPage";
import colors from "./colors";

const globalStyles = css`
@import url('https://fonts.googleapis.com/css2?family=Hind:wght@700&display=swap');

body {
  background-color: ${colors.notQuiteBlack};
  color: white;
  font-family: "Hind", "Helvetica", "Arial", sans-serif;
  margin: 0;
}
`;

function App() {
  return (
    <div>
      <Global styles={globalStyles}/>
      <LandingPage/>
    </div>
  );
};

export default App;
