/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import Header1 from "./header_1.svg";
import Header2 from "./header_2.svg";

interface HeaderBarProps {
  title?: string
  description?: string
}

const headerImageStyles = css`
  * {
    z-index: -1;
    top: 0;
    position: absolute;
    width: 100%;
    transition: height 1s;
  }
`;

const headerTextStyles = css`
  transition-property: font-size, margin-bottom;
  transition-duration: 1s;
  font-family: "Uni Sans", "Hind", "Arial", sans-serif;
  
  margin: 0 2rem 10rem 2rem;

  @media (max-width: 450px) {
    text-align: center;
  }
`;

function HeaderBar({ title, description }: HeaderBarProps) {
  if (!title) {
    title = "Python Discord Forms";
  }

  return (
      <div>
        <div css={headerImageStyles}>
          <Header1/>
          <Header2/>
        </div>

        <div css={css`${headerTextStyles}; margin-bottom: 12.5%;`}>
          <h1 css={css`font-size: 3vmax;
            margin-bottom: 0;`}>{title}</h1>
          <h1 css={css`font-size: 1.5vmax;`}>{description}</h1>
        </div>
      </div>
  )
}

export default HeaderBar;
