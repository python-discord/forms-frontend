/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";

interface SelectProps {
    options: Array<string>,
    state_dict: Map<string, any>
}

interface HandlerProps {
    props: SelectProps,
    ref: React.RefObject<HTMLDivElement>
}

class Select extends React.Component<SelectProps> {
    constructor(props: SelectProps) {
        super(props);
    }

    click_handler(this: HandlerProps, event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!this.ref.current) {
            return;
        }

        this.ref.current.classList.toggle("active");

        // @ts-ignore
        const target: Element = event.target;
        if (target.id === "option") {
            const selected_option: Element = this.ref.current.getElementsByClassName("selected_option")![0];
            const new_option_text: string = target.textContent!;

            if (selected_option.textContent === "...") {
                target.parentElement!.remove();
            } else {
                target.textContent = selected_option.textContent;
            }

            selected_option.textContent = new_option_text;
            this.props.state_dict.set("value", selected_option.textContent);
        }
    }

    render() {
        const container_ref: React.RefObject<HTMLDivElement> = React.createRef()

        return (
            <div className="select_container" ref={container_ref} onClick={this.click_handler.bind({ref: container_ref, props: this.props})}>
                <span className="select_arrow"/>
                <span className="selected_option">...</span>
                <div className="select_options_container">
                    <div className="select_options">
                        { this.props.options.map((option, index) => <div key={index}><hr/><div id="option">{option}</div></div>) }
                    </div>
                </div>
            </div>
        );
    }
}

export default Select;