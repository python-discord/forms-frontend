/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Link } from "react-router-dom";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import React, {SyntheticEvent, useEffect, useState, createRef, useRef} from "react";
import { useParams } from "react-router";
import { PropagateLoader } from "react-spinners";

import HeaderBar from "../components/HeaderBar";
import RenderedQuestion from "../components/Question";
import Loading from "../components/Loading";
import ScrollToTop from "../components/ScrollToTop";
import OAuth2Button  from "../components/OAuth2Button";

import { Form, FormFeatures, getForm } from "../api/forms";
import { OAuthScopes, checkScopes } from "../api/auth";
import colors from "../colors";
import { submitStyles, unselectable }  from "../commonStyles";
import { Question, QuestionType } from "../api/question";
import ApiClient from "../api/client";

interface PathParams {
    id: string
}

interface NavigationProps {
    form_state: boolean,  // Whether the form is open or not
    scopes: OAuthScopes[]
}

class Navigation extends React.Component<NavigationProps> {
    static containerStyles = css`
      margin: auto;
      width: 50%;

      text-align: center;
      font-size: 1.5rem;

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

    static returnStyles = css`
      padding: 0.5rem 2.2rem;
      border-radius: 8px;

      color: white;
      text-decoration: none;
      white-space: nowrap;

      background-color: ${colors.greyple};
      transition: background-color 300ms;

      :hover {
        background-color: ${colors.darkerGreyple};
      }
    `;

    constructor(props: NavigationProps) {
        super(props);
        this.setState({"logged_in": false});
    }

    render(): JSX.Element {
        let submit = null;

        if (this.props.form_state) {
            let inner_submit;
            if (this.props.scopes.includes(OAuthScopes.Identify) && !checkScopes(this.props.scopes)) {
                // Render OAuth button if login is required, and the scopes needed are not available
                inner_submit = <OAuth2Button scopes={this.props.scopes} rerender={() => this.setState({"logged_in": true})}/>;
            } else {
                inner_submit = <button form="form" type="submit">Submit</button>;
            }
            submit = <div css={submitStyles}>{ inner_submit }</div>;
        }

        return (
            <div css={[unselectable, Navigation.containerStyles]}>
                <div className={ "return_button" + (this.props.form_state ? "" : " closed") }>
                    <Link to="/" css={Navigation.returnStyles}>Return Home</Link>
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

const captchaStyles = css`
  text-align: center;
  
  margin-bottom: 1.5rem;
`;

function FormPage(): JSX.Element {
    const { id } = useParams<PathParams>();

    const [form, setForm] = useState<Form>();
    const [sending, setSending] = useState<boolean>();
    const [sent, setSent] = useState<boolean>();

    let captchaToken: string | null = null;
    const captchaRef = useRef<HCaptcha>(null);

    useEffect(() => {
        getForm(id).then(form => {
            setForm(form);
        });
    }, []);

    if (form && sent) {
        const thanksStyle = css`font-family: "Uni Sans", "Hind", "Arial", sans-serif; margin-top: 15.5rem;`;
        const divStyle = css`width: 80%;`;
        return (
            <div>
                <HeaderBar title={form.name} description={form.description}/>
                <div css={[unselectable, Navigation.containerStyles, divStyle]}>
                    <h3 css={thanksStyle}>{form.submitted_text ?? "Thanks for your response!"}</h3>
                    <div className={ "return_button closed" }>
                        <Link to="/" css={Navigation.returnStyles}>Return Home</Link>
                    </div>
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

    const refMap: Map<string, React.RefObject<RenderedQuestion>> = new Map();
    const questions = form.questions.map((question, index) => {
        const questionRef = createRef<RenderedQuestion>();
        refMap.set(question.id, questionRef);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <RenderedQuestion ref={questionRef} focus_ref={createRef<any>()} scroll_ref={createRef<HTMLDivElement>()} question={question} public_state={new Map()} key={index + Date.now()}/>;
    });

    async function handleSubmit(event: SyntheticEvent) {
        event.preventDefault();
        // Make copy to avoid losing value on state change.
        const submitCaptchaToken = captchaToken;

        // Client-side required validation
        const invalidFieldIDs: number[] = [];
        questions.forEach((prop, i) => {
            const question: Question = prop.props.question;
            if (!question.required) {
                return;
            }

            const questionRef = refMap.get(question.id);
            if (questionRef && questionRef.current) {
                questionRef.current.validateField();
            }
            // In case when field is invalid, add this to invalid fields list.
            if (prop.props.public_state.get("valid") === false) {
                invalidFieldIDs.push(i);
            }
        });

        if (invalidFieldIDs.length) {
            const firstErrored = questions[invalidFieldIDs[0]];
            if (firstErrored && firstErrored.props.scroll_ref) {
                // If any element is already focused, unfocus it to avoid not scrolling behavior.
                if (document.activeElement && document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }

                firstErrored.props.scroll_ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
                if (firstErrored.props.focus_ref && firstErrored.props.focus_ref.current) {
                    firstErrored.props.focus_ref.current.focus({ preventScroll: true });
                }
            }
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (!(FormFeatures.DisableAntispam in form!.features) && !submitCaptchaToken && captchaRef && captchaRef.current) {
            captchaRef.current.execute();
        }

        setSending(true);

        const answers: { [key: string]: unknown } = {};
        questions.forEach(prop => {
            const question: Question = prop.props.question;
            const options: string | string[] = question.data["options"];

            // Parse input from each question
            switch (question.type) {
                case QuestionType.Section:
                    answers[question.id] = false;
                    break;

                case QuestionType.Checkbox: {
                    if (typeof options !== "string") {
                        const keys: Map<string, string> = new Map();
                        options.forEach((val: string, index) => {
                            keys.set(val, `${("000" + index).slice(-4)}. ${val}`);
                        });
                        const pairs: { [key: string]: boolean } = { };
                        keys.forEach((val, key) => {
                            pairs[key] = !!prop.props.public_state.get(val);
                        });
                        answers[question.id] = pairs;
                    }
                    break;
                }

                case QuestionType.Code:
                default:
                    answers[question.id] = prop.props.public_state.get("value");
            }
        });

        const data: { [key: string]: unknown } = {response: answers};
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (!(FormFeatures.DisableAntispam in form!.features)) {
            data["captcha"] = submitCaptchaToken;
        }

        await ApiClient.post(`forms/submit/${id}`, data);
        setSending(false);
        setSent(true);
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

    let captcha = null;
    if (!(FormFeatures.DisableAntispam in form.features) && open) {
        captcha = (
            <div css={captchaStyles}>
                <HCaptcha
                    sitekey={process.env.HCAPTCHA_SITEKEY ? process.env.HCAPTCHA_SITEKEY : ""}
                    theme="dark"
                    onVerify={token => {
                        captchaToken = token;
                    }}
                    onExpire={() => {
                        captchaToken = null;
                    }}
                    ref={captchaRef}
                />
            </div>
        );
    }

    return (
        <div>
            <HeaderBar title={form.name} description={form.description}/>

            <div>
                <form id="form" onSubmit={handleSubmit} css={[formStyles, unselectable]}>
                    { closed_header }
                    { questions }
                </form>
                { captcha }
                <Navigation form_state={open} scopes={scopes}/>
            </div>

            <div css={css`margin-bottom: 10rem`}/>
            <ScrollToTop/>
        </div>
    );
}

export default FormPage;
