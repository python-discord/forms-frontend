/** @jsx jsx */
import {jsx, css} from "@emotion/react";
import colors from "../colors";
import {selectable} from "../commonStyles";

interface ErrorMessageProps {
    show: boolean,
    message: string,
    innerElement?: JSX.Element,
}

export default function ErrorMessage(props: ErrorMessageProps): JSX.Element | null {
    const styles = css`
      color: ${colors.error};
      font-size: 1.15rem;
      line-height: 1.1rem;
      margin: 1rem 0 0;

      visibility: ${props.show ? "visible" : "hidden"};
      opacity: ${props.show ? 1 : 0};
      transition: opacity 200ms, visibility 200ms;
    `;

    // These styles are not applied when inner element is explicitly set
    const floatingStyles = css`
      position: absolute;
      z-index: -1;
    `;

    return (
        <div tabIndex={-1} css={[styles, selectable, props.innerElement ? null : floatingStyles]}>
            {props.innerElement ? props.innerElement : props.message}
        </div>
    );
}
