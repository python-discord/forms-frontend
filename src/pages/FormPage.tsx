/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Link } from "react-router-dom";

import React, { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router";

import HeaderBar from "../components/HeaderBar";
import RenderedQuestion from "../components/Question";
import Loading from "../components/Loading";
import ScrollToTop from "../components/ScrollToTop";

import { Form, FormFeatures, getForm } from "../api/forms";
import colors from "../colors";
import { unselectable }  from "../commonStyles";


interface PathParams {
    id: string
}

interface NavigationProps {
    form_state: boolean  // Whether the form is open or not
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

      @media (max-width: 850px) {
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

      @media (max-width: 850px) {
        display: block;
      }
    `;

    returnStyles = css`
      padding: 0.5rem 2rem;
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

    submitStyles = css`
      text-align: right;

      button {
        padding: 0.5rem 4rem;
        cursor: pointer;

        border: none;
        border-radius: 8px;

        color: white;
        font: inherit;

        background-color: ${colors.blurple};
        transition: background-color 300ms;
      }

      button:hover {
        background-color: ${colors.darkerBlurple};
      }
    `;

    render(): JSX.Element {
        let submit = null;
        if (this.props.form_state) {
            submit = (
                <div css={this.submitStyles}>
                    <button form="form" type="submit">Submit</button>
                </div>
            );
        }

        return (
            <div css={[unselectable, this.containerStyles]}>
                <div className={ "return_button" + (this.props.form_state ? "" : " closed") }>
                    <Link to="/" css={this.returnStyles}>Return Home</Link>
                </div>
                <br css={this.separatorStyles}/>
                { submit }
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
    let foo;

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
                <Navigation form_state={open}/>
            </div>

            <div css={css`margin-bottom: 10rem`}/>
            <ScrollToTop/>
        </div>
    );
}

export default FormPage;
