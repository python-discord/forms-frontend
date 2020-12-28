/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";

interface SelectProps {
    name: string,
    options: Array<string>,
    state_dict: Map<string, any>
}

interface option_handler_args {
    props: SelectProps,
    ref: React.RefObject<HTMLLabelElement>
}

function option_handler(this: option_handler_args, event: React.MouseEvent<HTMLLabelElement, MouseEvent>): void {
    // The target element should always point to a label,
    // as that is the only element that should use this handler.
    // @ts-ignore
    const target: HTMLLabelElement = event.target;

    const button: HTMLLabelElement = this.ref.current!;
    // TODO: Close menu on click

    button.textContent = target.textContent;
    this.props.state_dict.set(this.props.name, target.textContent);

    event.preventDefault();
}

export default function Select(props: SelectProps) {
    const ref: React.RefObject<HTMLLabelElement> = React.createRef();
    const handler = option_handler.bind({ props, ref });

    return (
        <div className="select_container">
            <label className="selected_option" ref={ref}>...</label>
            <span className="select_arrow"/>
            <span className="select_options">
                <br/>
                { props.options.map((option, index) => <label key={index} onClick={handler}>{option}</label>) }
            </span>
        </div>
    );
}
