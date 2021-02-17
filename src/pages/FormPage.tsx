/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Link } from "react-router-dom";

import React, { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router";

import HeaderBar from "../components/HeaderBar";
import RenderedQuestion from "../components/Question";
import Loading from "../components/Loading";
import ScrollToTop from "../components/ScrollToTop";
import OAuth2Button  from "../components/OAuth2Button";

import { Form, FormFeatures, getForm } from "../api/forms";
import { OAuthScopes, checkScopes } from "../api/auth";
import colors from "../colors";
import { submitStyles, unselectable } from "../commonStyles";


interface PathParams {
    id: string
}

interface NavigationProps {
    form_state: boolean,  // Whether the form is open or not
    scopes: OAuthScopes[]
}

class Navigation extends React.Component<NavigationProps> {
    containerStyles = css`
      margin: auto;
      width: 50%;

      text-align: center;
      font-size: 1.5rem;
      white-space: nowrap;

      > div {
        display: inline-block;
        margin: 2rem auto;
        width: 50%;
      }

      @media (max-width: 870px) {
        width: 100%;

        > div {
          display: flex;
          justify-content: center;

          margin: 0 auto;
        }
      }

      .return_button {
        text-align: left;
      }

      .return_button.closed {
        text-align: center;
      }
    `;

    separatorStyles = css`
      height: 0;
      display: none;

      @media (max-width: 870px) {
        display: block;
      }
    `;

    returnStyles = css`
      padding: 0.55rem 2.2rem;
      border-radius: 8px;

      color: white;
      text-decoration: none;

      background-color: ${colors.greyple};
      transition: background-color 300ms;

      :hover {
        background-color: ${colors.darkerGreyple};
      }
    }
    `;

    constructor(props: NavigationProps) {
        super(props);
        this.setState({"logged_in": false});
    }

    render(): JSX.Element {
        let submit = null;

        if (this.props.form_state) {
            if (this.props.scopes.includes(OAuthScopes.Identify) && !checkScopes(this.props.scopes)) {
                // Render OAuth button if login is required, and the scopes needed are not available
                submit = <OAuth2Button scopes={this.props.scopes} rerender={() => this.setState({"logged_in": true})}/>;
            } else {
                submit = <button form="form" type="submit">Submit</button>;
            }
        }

        return (
            <div css={[unselectable, this.containerStyles]}>
                <div className={ "return_button" + (this.props.form_state ? "" : " closed") }>
                    <Link to="/" css={this.returnStyles}>Return Home</Link>
                </div>
                <br css={this.separatorStyles}/>
                <div css={submitStyles}>{ submit }</div>
            </div>
        );
    }
}

const formStyles = css`
  margin: auto;
  width: 50%;

  @media (max-width: 800px) {
    /* Make form larger on mobile and tablet screens */
    width: 80%;
  }
`;

const closedHeaderStyles = css`
  margin-bottom: 2rem;
  padding: 1rem 4rem;
  border-radius: 8px;

  text-align: center;
  font-size: 1.5rem;

  background-color: ${colors.error};

  @media (max-width: 500px) {
    padding: 1rem 1.5rem;
  }
`;

function FormPage(): JSX.Element {
    const { id } = useParams<PathParams>();

    const [form, setForm] = useState<Form>();

    useEffect(() => {
        getForm(id).then(form => {
            setForm(form);
        });
    }, []);

    if (!form) {
        return <Loading/>;
    }

    const questions = form.questions.map((question, index) => {
        return <RenderedQuestion question={question} public_state={new Map()} key={index + Date.now()}/>;
    });

    function handleSubmit(event: SyntheticEvent) {
        questions.forEach(prop => {
            const question = prop.props.question;

            // TODO: Parse input from each question, and submit
            switch (question.type) {
                default:
                    console.log(question.id, prop.props.public_state);
            }
        });

        event.preventDefault();
    }

    const open: boolean = form.features.includes(FormFeatures.Open);
    const require_auth: boolean = form.features.includes(FormFeatures.RequiresLogin);

    const scopes = [];
    if (require_auth) {
        scopes.push(OAuthScopes.Identify);
        if (form.features.includes(FormFeatures.CollectEmail)) { scopes.push(OAuthScopes.Email); }
    }

    let closed_header = null;
    if (!open) {
        closed_header = <div css={closedHeaderStyles}>This form is now closed. You will not be able to submit your response.</div>;
    }

    return (
        <div>
            <HeaderBar title={form.name} description={form.description}/>

            <div>
                <form id="form" onSubmit={handleSubmit} css={[formStyles, unselectable]}>
                    { closed_header }
                    { questions }
                </form>
                <Navigation form_state={open} scopes={scopes}/>
            </div>

            <div css={css`margin-bottom: 10rem`}/>
            <ScrollToTop/>
        </div>
    );
}

export default FormPage;
