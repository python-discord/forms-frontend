/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import Tag from "./Tag";

import colors from "../colors";

import { Form, FormFeatures } from "../api/forms";

interface FormListingProps {
  form: Form
}

function FormListing({ form }: FormListingProps): JSX.Element {
    const listingStyle = css`
    background-color: ${form.features.includes(FormFeatures.Open) ? colors.success : colors.darkButNotBlack};
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
      transform: scale(1.03);
    }
  `;

    let closedTag;

    if (!form.features.includes(FormFeatures.Open)) {
        closedTag = <Tag text="CLOSED" color={colors.error}/>;
    }

    return <Link to={`/form/${form.id}`} css={listingStyle}>
        <div>
            <h3 css={{fontSize: "1.5em", marginBottom: "0"}}>{closedTag}{form.name} <FontAwesomeIcon icon={faArrowRight} css={{fontSize: "0.75em", paddingBottom: "1px"}}/></h3>
            <p css={{marginTop: "5px"}}>{form.description}</p>
        </div>
    </Link>;
}

export default FormListing;
