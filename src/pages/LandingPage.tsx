/** @jsx jsx */
import { jsx } from "@emotion/core";

import HeaderBar from "../components/HeaderBar";
import FormListing from "../components/FormListing";

function LandingPage() {
  return <div>
    <HeaderBar/>
    <div css={{marginLeft: "20px"}}>
      <h1>Welcome to Python Discord Forms</h1>

      <h3>Available forms</h3>

      <FormListing title="Ban Appeals" description="Appealing bans from the Discord server" open={true}/>
      <FormListing title="Insights 2020" description="Insights about the Python Discord community" open={false}/>
    </div>
  </div>
}

export default LandingPage;
