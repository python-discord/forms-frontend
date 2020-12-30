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

class BackToTop extends React.Component {
    handleScroll(this: React.RefObject<HTMLDivElement>) {
        if (window.pageYOffset > 250) {
            this.current!.style.opacity = "1";
        } else {
            this.current!.style.opacity = "0";
        }
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll, true);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    render() {
        const ref: React.RefObject<HTMLDivElement> = React.createRef();
        this.handleScroll = this.handleScroll.bind(ref);
        return <div css={styles} ref={ref} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}/>
    }
}

export default BackToTop;