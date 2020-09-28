/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import SVG from "react-inlinesvg";

import header1 from "./header_1.svg";
import header2 from "./header_2.svg";

const headerImageStyles = css`
z-index: -1;
top: 0;
position: absolute;
width: 100%;
transition: height 1s;

@media (max-width: 660px) {
  height: 140px;
}
`;

function HeaderBar() {
  return <div>
    <div>
      <SVG src={header1} css={headerImageStyles}/>
      <SVG src={header2} css={headerImageStyles}/>
    </div>
    <h1 css={css`
      font-size: 4em;
      margin: 0;
      margin-top: 10px;
      margin-left: 30px;
      margin-bottom: 200px;
      transition-property: font-size, margin-bottom;
      transition-duration: 1s;

      @media (max-width: 660px) {
        margin-bottom: 100px;
        font-size: 3em;
      }

      @media (max-width: 510px) {
        font-size: 2em;
      }
    `}>
      Python Discord Forms
    </h1>
   </div>
}

export default HeaderBar;
