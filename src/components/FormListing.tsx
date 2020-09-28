/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import colors from "../colors";

interface FormListingProps {
  title: string,
  description: string,
  open: boolean
}

function FormListing(props: FormListingProps) {
  const listingStyle = css`
    background-color: ${props.open ? colors.success : colors.darkButNotBlack};
    width: 80%;
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 20px;
    transition: filter 100ms;

    &:hover {
      filter: brightness(110%);
    }
  `;

  let closedTag;

  if (!props.open) {
    closedTag = <span css={css`
      font-size: 0.75em;
      background-color: ${colors.error};
      border-radius: 5px;
      margin: 0;
      padding-top: 3px;
      margin-right: 5px;
      padding-left: 5px;
      padding-right: 5px;
    `}>CLOSED</span>;
  };

  return <div css={listingStyle}>
    <h3 css={{fontSize: "1.5em", marginBottom: "0"}}>{closedTag}{props.title} <FontAwesomeIcon icon={faArrowRight} css={{fontSize: "0.75em", paddingBottom: "1px"}}/></h3>
    <p css={{marginTop: "5px"}}>{props.description}</p>
  </div>
}

export default FormListing;
