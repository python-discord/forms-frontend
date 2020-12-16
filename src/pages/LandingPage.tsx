/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { useEffect, useState } from "react";

import HeaderBar from "../components/HeaderBar";
import FormListing from "../components/FormListing";

import { getForms, Form } from "../api/forms";
import OAuth2Button from "../components/OAuth2Button";
import Loading from "../components/Loading";

function LandingPage() {
  const [forms, setForms] = useState<Form[]>();

  useEffect(() => {
    const fetchForms = async () => {
      setForms(await getForms());
    }
    fetchForms();
  }, []);

  if (!forms) {
    return <Loading/>;
  }

  return <div>
    <HeaderBar/>
    <div>

      <div css={css`
        display: flex;
        align-items: center;
        flex-direction: column;
      `}>
        <h1>Available Forms</h1>

        <OAuth2Button/>


        {forms.map(form => (
          <FormListing key={form.id} form={form}/>
        ))}
      </div>
    </div>
  </div>
}

export default LandingPage;
