/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";

const styles = css`
  width: 2.5rem;
  height: 2.5rem;

  position: fixed;
  bottom: 3rem;
  right: 3rem;
  
  background-color: #7289DA; /* Blurple */
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
    constructor(props: any) {
        super(props);
        last_ref = React.createRef();
    }

    handleScroll() {
        if (window.pageYOffset > 250) {
            last_ref.current!.style.opacity = "1";
        } else {
            last_ref.current!.style.opacity = "0";
        }
    }

    componentDidMount() {
        // Register event handler
        window.addEventListener("scroll", this.handleScroll);
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
        // Hide previous iterations, and register handler for current one
        if (last_ref.current) {
            last_ref.current.style.opacity = "0";
        }

        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        // Unregister handler
        window.removeEventListener("scroll", this.handleScroll);
    }

    render() {
        return <div css={styles} ref={last_ref} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}/>
    }
}

export default ScrollToTop;