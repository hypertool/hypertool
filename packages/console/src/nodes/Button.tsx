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
    disabled?: boolean;
    disableElevation?: boolean;
    disableFocusRipple?: boolean;
    disableRipple?: boolean;
}

export const Button: CraftComponent<Props> = (props: Props): ReactElement => {
    const {
        size,
        variant,
        color,
        text,
        disabled,
        disableElevation,
        disableFocusRipple,
        disableRipple,
    } = props;

    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <MuiButton
                size={size as any}
                variant={variant}
                color={color}
                disabled={disabled}
                disableElevation={disableElevation}
                disableFocusRipple={disableFocusRipple}
                disableRipple={disableRipple}
            >
                {text}
            </MuiButton>
        </div>
    );
};

const defaultProps: Props = {
    size: "small",
    variant: "contained",
    color: "primary",
    text: "CLICK ME",
    disabled: false,
    disableElevation: false,
    disableFocusRipple: false,
    disableRipple: false,
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
                                id: "disabled",
                                title: "Disabled",
                                type: "switch",
                                size: "small",
                                help: "Determines wether the button is disabled, or not.",
                            },
                            {
                                id: "disableElevation",
                                title: "Disable Elevation",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the button should have elevation or not.",
                            },
                            {
                                id: "disableFocusRipple",
                                title: "Disable Focus Ripple",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the button should have focus ripple or not.",
                            },
                            {
                                id: "disableRipple",
                                title: "Disable Ripple",
                                type: "switch",
                                size: "small",
                                help: "Determines whether a ripple effect is rendered or not when the button is clicked.",
                            },
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
