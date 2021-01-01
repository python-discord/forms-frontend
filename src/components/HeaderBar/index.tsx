/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import Header1 from "./header_1.svg";
import Header2 from "./header_2.svg";
import Logo from "./logo.svg"

import { Link } from "react-router-dom"

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
  transition: margin 1s;
  font-family: "Uni Sans", "Hind", "Arial", sans-serif;

  margin: 0 2rem 10rem 2rem;
  
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

  @media (max-width: 480px) {
    margin-top: 7rem;
    text-align: center;

    .title {
      font-size: 5vmax;
    }

    .description {
      font-size: 2vmax;
    }
  }
`;

const homeButtonStyles = css`
  svg {
    transform: scale(0.25);
    transition: top 300ms, transform 300ms;

    @media (max-width: 480px) {
      transform: scale(0.15);
    }
  }
  
  * {
    position: absolute;
    top: -10rem;
    right: 1rem;

    z-index: 0;
    transform-origin: right;

    @media (max-width: 700px) {
      top: -11.5rem;
    }

    @media (max-width: 480px) {
      top: -12.7rem;
    }
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
                <h1 className="title" css={css``}>{title}</h1>
                <h1 className="description">{description}</h1>
            </div>

            <Link to="/" css={homeButtonStyles}>
                <Logo/>
            </Link>
        </div>
    )
}

export default HeaderBar;
