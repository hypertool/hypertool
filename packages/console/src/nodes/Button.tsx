import type { ReactElement } from "react";

import { Button as MuiButton } from "@mui/material";

import { useNode } from "@craftjs/core";

import PropertiesForm from "../layouts/app-builder/panels/properties-editor/PropertiesForm";
import type {
    ButtonSize,
    ButtonVariant,
    Color,
    CraftComponent,
} from "../types";

interface Props {
    size?: ButtonSize;
    variant?: ButtonVariant;
    color?: Color;
    text?: string;
}

export const Button: CraftComponent<Props> = (props: Props): ReactElement => {
    const { size, variant, color, text } = props;

    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <MuiButton
            ref={(ref) => connect(drag(ref as any))}
            size={size as any}
            variant={variant}
            color={color}
        >
            {text}
        </MuiButton>
    );
};

const defaultProps: Props = {
    size: "small",
    variant: "contained",
    color: "primary",
    text: "CLICK ME",
};

Button.defaultProps = defaultProps;

Button.craft = {
    props: defaultProps,
    related: {
        settings: () => (
            <PropertiesForm
                groups={[
                    {
                        title: "General",
                        fields: [
                            {
                                id: "size",
                                size: "small",
                                help: "The size of the button.",
                                type: "select",
                                required: true,
                                title: "Size",
                                options: [
                                    { value: "small", title: "Small" },
                                    { value: "medium", title: "Medium" },
                                    { value: "large", title: "Large" },
                                ],
                            },
                            {
                                id: "color",
                                size: "small",
                                help: "The color of the button.",
                                type: "select",
                                required: true,
                                title: "Color",
                                options: [
                                    { value: "inherit", title: "Inherit" },
                                    { value: "primary", title: "Primary" },
                                    { value: "secondary", title: "Secondary" },
                                    { value: "success", title: "Success" },
                                    { value: "error", title: "Error" },
                                    { value: "info", title: "Info" },
                                    { value: "warning", title: "Warning" },
                                ],
                            },
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
