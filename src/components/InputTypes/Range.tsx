/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";

interface RangeProps {
    question_id: string,
    options: Array<string>,
    state_dict: Map<string, string | boolean | null>
}

let last_selection: Element;

interface handler_props {
    state_dict: Map<string, string | boolean | null>,
    ref: React.RefObject<HTMLLabelElement>
}

function handler(this: handler_props): void {
    if (last_selection) {
        last_selection.classList.toggle("selected");
    }

    const dot: Element = this.ref.current!.lastElementChild!; // eslint-disable-line
    dot.classList.toggle("selected");

    last_selection = dot;

    const value: string = this.ref.current!.textContent!; //eslint-disable-line
    this.state_dict.set("value", value);
}

export default function Range(props: RangeProps): JSX.Element {
    const range = props.options.map((option, index) => {
        const ref: React.RefObject<HTMLLabelElement> = React.createRef();
        return (
            <label key={index} ref={ref} onClick={handler.bind({state_dict: props.state_dict, ref: ref})}>
                <span>{option}</span>
                <div className="range_dot"/>
            </label>
        );
    });

    return (
        <div className="range">
            { range }

            <div className="range_slider_container">
                <div className="range_slider"/>
            </div>
        </div>
    );
}
