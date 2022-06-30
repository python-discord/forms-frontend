/** @jsx jsx */
import {jsx, css} from "@emotion/react";

import React from "react";
import {Link} from "react-router-dom";

import colors from "../../colors";
import {submitStyles, unselectable} from "../../commonStyles";

import {checkScopes, OAuthScopes} from "../../api/auth";
import OAuth2Button from "../../components/OAuth2Button";


interface NavigationProps {
    form_state: boolean,  // Whether the form is open or not
    scopes: OAuthScopes[]
}

export default class Navigation extends React.Component<NavigationProps> {
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

    static separatorStyles = css`
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
        this.state = {"logged_in": false};
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
                <br css={Navigation.separatorStyles}/>
                { submit }
            </div>
        );
    }
}
