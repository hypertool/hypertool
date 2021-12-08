import React from "react";
import "./button.css";

export interface ButtonProps {
    /**
     * `true` if the button should use primary styles.
     */
    primary?: boolean;
    /**
     * The background color of the button container.
     */
    backgroundColor?: string;
    /**
     * The size of the component.
     */
    size?: "small" | "medium" | "large";
    /**
     * The text contents inside the button.
     */
    label: string;
    /**
     * Optional click handler.
     */
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button = (props: ButtonProps) => {
    const { primary, backgroundColor, size, onClick, label } = props;
    const mode = primary
        ? "storybook-button--primary"
        : "storybook-button--secondary";
    return (
        <button
            type="button"
            className={[
                "storybook-button",
                `storybook-button--${size}`,
                mode,
            ].join(" ")}
            style={backgroundColor ? { backgroundColor } : {}}
            onClick={onClick}>
            {label}
        </button>
    );
};

Button.defaultProps = {
    primary: true,
    size: "medium",
};

export default Button;
