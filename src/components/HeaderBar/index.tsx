/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import Header1 from "./header_1.svg";
import Header2 from "./header_2.svg";

interface HeaderBarProps {
  title?: string
}

const headerImageStyles = css`
z-index: -1;
top: 0;
position: absolute;
width: 100%;
transition: height 1s;
`;

function HeaderBar({ title }: HeaderBarProps): JSX.Element {
    if (!title) {
        title = "Python Discord Forms";
    }
  
    return <div>
        <div>
            <Header1 css={headerImageStyles}/>
            <Header2 css={headerImageStyles}/>
        </div>
        <h1 css={css`
      font-size: 4vw;
      margin: 0;
      margin-top: 30px;
      margin-left: 30px;
      margin-bottom: 200px;
      transition-property: font-size, margin-bottom;
      transition-duration: 1s;
      font-family: "Uni Sans", "Hind", "Arial", sans-serif;

      @media (max-width: 1000px) {
        margin-top: 15px;
        font-size: 8vw;
      }

      @media (max-width: 770px) {
        margin-top: 15px;
        font-size: 6vw;
        margin-bottom: 100px;
      }
      @media (max-width: 450px) {
        text-align: center;
        margin-left: 0;
      }
    `}>
            {title}
        </h1>
    </div>;
}

export default HeaderBar;
