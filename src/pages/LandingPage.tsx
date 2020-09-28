/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import HeaderBar from "../components/HeaderBar";
import FormListing from "../components/FormListing";

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
        <FormListing title="Ban Appeals" description="Appealing bans from the Discord server" open={true}/>
        <FormListing title="Insights 2020" description="Insights about the Python Discord community" open={false}/>
      </div>
    </div>
  </div>
}

export default LandingPage;
