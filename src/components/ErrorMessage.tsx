/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import colors from "../colors";

interface ErrorMessageProps {
    show: boolean,
    message: string
}

const styles = css`
  color: ${colors.error};
  font-size: 1.15rem;
  line-height: 1.1rem;
  margin: 1rem 0 0;
`;

export default function ErrorMessage(props: ErrorMessageProps): JSX.Element|null {
    if (!props.show) {
        return null;
    }

    return (
        <p css={styles}>{props.message}</p>
    );
}
