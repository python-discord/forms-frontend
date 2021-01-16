/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import colors from "../colors";

import smoothscroll from "smoothscroll-polyfill";
smoothscroll.polyfill();

const styles = css`
  width: 2.5rem;
  height: 2.5rem;

  position: fixed;
  bottom: 3rem;
  right: 3rem;
  
  background-color: ${colors.blurple};
  border-radius: 50%;

  opacity: 0;
  transition: opacity 300ms;
  
  :after {
    display: inline-block;
    content: "";

    position: fixed;
    bottom: 3.5rem;
    right: 3.65rem;
    
    border: solid whitesmoke;
    border-width: 0.35rem 0.35rem 0 0;
    padding: 0.4rem;

    transform: rotate(-45deg);
  }
  
  @media (max-width: 800px) {
    bottom: 1.5rem;
    right: 1.5rem;
    
    :after {
      bottom: 2rem;
      right: 2.15rem;
    }
  }
`;

let last_ref: React.RefObject<HTMLDivElement>;

class ScrollToTop extends React.Component {
    constructor(props: Record<string, never>) {
        super(props);
        last_ref = React.createRef();
    }

    handleScroll(): void {
        if (!last_ref.current) return;

        if (window.pageYOffset > 250) {
            last_ref.current.style.opacity = "1";
            last_ref.current.style.cursor = "pointer";
        } else {
            last_ref.current.style.opacity = "0";
            last_ref.current.style.cursor = "default";
        }
    }

    componentDidMount(): void {
        // Register event handler
        window.addEventListener("scroll", this.handleScroll, {passive: true});
    }

    componentDidUpdate(): void {
        // Hide previous iterations, and register handler for current one
        if (last_ref.current) {
            last_ref.current.style.opacity = "0";
        }

        window.addEventListener("scroll", this.handleScroll, {passive: true});
    }

    componentWillUnmount(): void {
        // Unregister handler
        window.removeEventListener("scroll", this.handleScroll);
    }

    render(): JSX.Element {
        return <div css={styles} key={Date.now()} ref={last_ref} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}/>;
    }
}

export default ScrollToTop;
