/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "react-router-dom";

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
    width: 60%;
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    transition-property: transform, width;
    transition-duration: 500ms;
    text-decoration: none;
    color: inherit;

    @media (max-width: 575px) {
      width: 80%;
    }

    &:hover {
      transform: scale(1.01);
    }
  `;

  let closedTag;

  if (!props.open) {
    closedTag = <Tag text="CLOSED" color={colors.error}/>
  };

  return <Link to="/form" css={listingStyle}>
    <div>
      <h3 css={{fontSize: "1.5em", marginBottom: "0"}}>{closedTag}{props.title} <FontAwesomeIcon icon={faArrowRight} css={{fontSize: "0.75em", paddingBottom: "1px"}}/></h3>
      <p css={{marginTop: "5px"}}>{props.description}</p>
    </div>
  </Link>
}

export default FormListing;
