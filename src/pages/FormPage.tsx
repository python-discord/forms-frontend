/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Link } from "react-router-dom";

import React, { SyntheticEvent, useEffect, useState, createRef } from "react";
import { useParams } from "react-router";
import { PropagateLoader } from "react-spinners";

import HeaderBar from "../components/HeaderBar";
import RenderedQuestion from "../components/Question";
import Loading from "../components/Loading";
import ScrollToTop from "../components/ScrollToTop";

import { Form, FormFeatures, getForm } from "../api/forms";
import colors from "../colors";
import { unselectable, containerStyles, separatorStyles, returnStyles }  from "../commonStyles";
import { Question, QuestionType } from "../api/question";
import ApiClient from "../api/client";


interface PathParams {
    id: string
}

interface NavigationProps {
    form_state: boolean  // Whether the form is open or not
}

class Navigation extends React.Component<NavigationProps> {
    submitStyles = css`
      text-align: right;
      white-space: nowrap;

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
            <div css={[unselectable, containerStyles]}>
                <div className={ "return_button" + (this.props.form_state ? "" : " closed") }>
                    <Link to="/" css={returnStyles}>Return Home</Link>
                </div>
                <br css={separatorStyles}/>
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
    const [sending, setSending] = useState<boolean>();
    const [sent, setSent] = useState<boolean>();

    useEffect(() => {
        getForm(id).then(form => {
            setForm(form);
            setSent(true);
        });
    }, []);

    if (form && sent) {
        const thanksStyle = css`font-family: "Uni Sans", "Hind", "Arial", sans-serif; margin-top: 15.5rem;`;
        const divStyle = css`width: 80%;`;
        return (
            <div>
                <HeaderBar title={form.name} description={form.description}/>
                <div css={[unselectable, containerStyles, divStyle]}>
                    <h3 css={thanksStyle}>{form.submitted_text ?? "Thanks for your response!"}</h3>
                    <div className={ "return_button closed" }>
                        <Link to="/" css={returnStyles}>Return Home</Link>
                    </div>
                    <br css={separatorStyles}/>
                </div>
            </div>
        );
    }

    if (sending) {
        return (
            <div>
                <HeaderBar title={"Submitting..."}/>
                <div css={{display: "flex", justifyContent: "center", paddingTop: "40px"}}>
                    <PropagateLoader color="white"/>
                </div>
            </div>
        );
    }

    if (!form) {
        return <Loading/>;
    }

    const questions = form.questions.map((question, index) => {
        return <RenderedQuestion ref={createRef<RenderedQuestion>()} scroll_ref={createRef<HTMLDivElement>()} question={question} public_state={new Map()} key={index + Date.now()}/>;
    });

    async function handleSubmit(event: SyntheticEvent) {
        event.preventDefault();
        // Client-side required validation
        const invalidFieldIds: number[] = [];
        questions.forEach((prop, i) => {
            const question: Question = prop.props.question;
            if (!question.required) {
                return;
            }

            prop.ref.current.validateField();
            // In case when field is invalid, add this to invalid fields list.
            if (prop.props.public_state.get("valid") === false) {
                invalidFieldIds.push(i);
            }
        });

        if (invalidFieldIds.length) {
            const firstErrored = questions[invalidFieldIds[0]];
            if (firstErrored !== undefined) {
                firstErrored.props.scroll_ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        setSending(true);

        const answers = {};
        questions.forEach(prop => {
            const question = prop.props.question;
            const options: string | string[] = prop.props.question.data["options"];

            // TODO: Parse input from each question, and submit
            switch (question.type) {
                case QuestionType.Section:
                    answers[question.id] = false;
                    break;

                case QuestionType.Code:
                    answers[question.id] = "";
                    break;

                case QuestionType.Checkbox:
                    if (typeof options !== "string") {
                        const keys: Map<string, string> = new Map();
                        options.forEach((val, index) => {
                            keys.set(val, `${("000" + index).slice(-4)}. ${val}`);
                        });
                        const pairs = {};
                        keys.forEach((val, key) => {
                            pairs[key] = !!prop.props.public_state.get(val);
                        });
                        answers[question.id] = pairs;
                    }
                    break;

                default:
                    answers[question.id] = prop.props.public_state.get("value");
            }
        });

        await ApiClient.post(`forms/submit/${id}`, {response: answers});
        setSending(false);
        setSent(true);
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
