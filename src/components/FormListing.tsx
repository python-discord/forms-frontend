/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import Tag from "./Tag";

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
    closedTag = <Tag text="CLOSED" color={colors.error}/>
  };

  return <div css={listingStyle}>
    <h3 css={{fontSize: "1.5em", marginBottom: "0"}}>{closedTag}{props.title} <FontAwesomeIcon icon={faArrowRight} css={{fontSize: "0.75em", paddingBottom: "1px"}}/></h3>
    <p css={{marginTop: "5px"}}>{props.description}</p>
  </div>
}

export default FormListing;
