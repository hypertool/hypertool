import { FunctionComponent, ReactElement } from "react";

import { Button as MaterialButton } from "@mui/material";

import { useNode } from "@craftjs/core";

import PropertiesForm from "../layouts/app-builder/panels/properties-editor/PropertiesForm";

import { CraftProps } from ".";

interface ButtonProps {
    size?: string | number;
    variant?: "text" | "outlined" | "contained";
    color?: "primary" | "secondary";
    text: string;
    children?: ReactElement | any;
}

type CraftComponent<Props> = FunctionComponent<Props> & CraftProps;

export const Button: CraftComponent<ButtonProps> = (
    props: ButtonProps,
): ReactElement => {
    const {
        size = "small",
        variant = "contianed",
        color = "primary",
        text,
        children,
    } = props;

    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <MaterialButton
            ref={(ref) => connect(drag(ref as any))}
            size={size as any}
            variant={variant as any}
            color={color as any}
        >
            <div>{text}</div>
            {children}
        </MaterialButton>
    );
};

Button.craft = {
    props: {
        size: "small",
        variant: "contained",
        color: "primary",
        text: "Click me",
    },
    related: {
        settings: () => (
            <PropertiesForm
                groups={[
                    {
                        title: "General",
                        fields: [
                            {
                                id: "text",
                                size: "small",
                                help: "The text of the button.",
                                type: "text",
                                required: true,
                                title: "Text",
                            },
                            {
                                id: "variant",
                                size: "small",
                                help: "The type of the button.",
                                type: "select",
                                required: true,
                                title: "Variant",
                                options: [
                                    { value: "outlined", title: "Outlined" },
                                    { value: "text", title: "Text" },
                                    { value: "contained", title: "Contained" },
                                ],
                            },
                        ],
                    },
                ]}
                validationSchema={undefined}
            />
        ),
    },
};
