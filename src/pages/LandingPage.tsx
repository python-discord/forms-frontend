/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import HeaderBar from "../components/HeaderBar";
import FormListing from "../components/FormListing";

import { getForms } from "../api/forms";

function LandingPage() {
  return <div>
    <HeaderBar/>
    <div>

      <div css={css`
        display: flex;
        align-items: center;
        flex-direction: column;
      `}>
        <h1>Available Forms</h1>
        

        {getForms().map(form => (
          <FormListing key={form.id} form={form}/>
        ))}
      </div>
    </div>
  </div>
}

export default LandingPage;
