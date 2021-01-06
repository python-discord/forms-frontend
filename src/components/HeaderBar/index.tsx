/** @jsx jsx */
import { jsx, css } from "@emotion/react";

import Header1 from "./header_1.svg";
import Header2 from "./header_2.svg";
import Logo from "./logo.svg";

import { useHistory } from "react-router-dom";

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

const homeButtonStyles = css`
  display: flex;
  z-index: 0;
  cursor: pointer;
  position: absolute;

  transform-origin: top left;

  transform: scale(0.25);
  transition: transform 300ms;

  @media (max-width: 900px) {
    transform: scale(0.2);
  }

  @media (max-width: 480px) {
    top: 0;
    width: 500vw; /* 100% // 0.2 (scaling) */
    justify-content: center;
  }
`;

const headerTextStyles = css`
  transition: margin 1s;
  font-family: "Uni Sans", "Hind", "Arial", sans-serif;

  margin: 0 2rem 10rem 7rem;

  .title {
    font-size: 3vmax;
    margin-bottom: 0;
  }

  .description {
    font-size: 1.5vmax;
  }

  .title, .description {
    transition: font-size 1s;
  }

  @media (max-width: 900px) {
    margin-left: 6rem;
  }

  @media (max-width: 480px) {
    margin-top: 7rem;
    margin-left: 2rem;
    text-align: center;

    .title {
      font-size: 5vmax;
    }

    .description {
      font-size: 2vmax;
    }
  }
`;

function HeaderBar({ title, description }: HeaderBarProps): JSX.Element {
    const history = useHistory();
    if (!title) {
        title = "Python Discord Forms";
    }

    return (
        <div>
            <div css={headerImageStyles}>
                <Header1/>
                <Header2/>
            </div>

            <div css={homeButtonStyles} onClick={() => history.push("/")}>
                <Logo/>
            </div>

            <div css={css`${headerTextStyles}; margin-bottom: 12.5%;`}>
                <h1 className="title">{title}</h1>
                <h1 className="description">{description}</h1>
            </div>
        </div>
    );
}

export default HeaderBar;
