/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";

interface SelectProps {
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
    const active: HTMLLabelElement = this.ref.current!;

    const selected_content: string = target.textContent!;

    if (active.textContent === "...") {
        target.parentElement!.remove();
    } else {
        target.textContent = active.textContent;
    }

    active.textContent = selected_content;
    this.props.state_dict.set("value", active.textContent);

    event.preventDefault();
}

export default function Select(props: SelectProps) {
    const ref: React.RefObject<HTMLLabelElement> = React.createRef();
    const handler = option_handler.bind({ props, ref });

    const top_ref: React.Ref<HTMLDivElement> = React.createRef();

    return (
        <div className="select_container" ref={top_ref} onClick={ () => top_ref.current!.classList.toggle("active_select_container") }>
            <span className="select_arrow"/>
            <div className="selected_option"><label ref={ref}>...</label></div>
            <span className="select_options">
                { props.options.map((option, index) => (
                    <div key={index}>
                        <hr/>
                        <label onClick={handler}>{option}</label>
                    </div>
                )) }
            </span>
        </div>
    );
}
