/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import colors from "../colors";

interface ErrorMessageProps {
    show: boolean,
    message: string
}

export default function ErrorMessage(props: ErrorMessageProps): JSX.Element | null {
    const styles = css`
      color: ${colors.error};
      font-size: 1.15rem;
      line-height: 1.1rem;
      margin: 1rem 0 0;
      visibility: ${props.show ? "visible" : "hidden"};
      position: absolute;
      z-index: -1;
    `;

    return (
        <p css={styles}>{props.message}</p>
    );
}
