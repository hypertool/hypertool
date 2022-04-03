import type { ReactElement } from "react";

import { Button as MuiButton } from "@mui/material";

import { useSymbolReference } from "../hooks";
import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type {
    ButtonSize,
    ButtonVariant,
    Color,
    CraftComponent,
    ISymbolReference,
} from "../types";

import Node from "./Node";

interface IButtonProps {
    size?: ButtonSize;
    variant?: ButtonVariant;
    color?: Color;
    text?: string;
    disabled?: boolean;
    disableElevation?: boolean;
    disableFocusRipple?: boolean;
    disableRipple?: boolean;
    onClick?: ISymbolReference;
}

const ButtonNode: CraftComponent<IButtonProps> = (
    props: IButtonProps,
): ReactElement => {
    const {
        size,
        variant,
        color,
        text,
        disabled,
        disableElevation,
        disableFocusRipple,
        disableRipple,
        onClick,
    } = props;

    const handleClick = useSymbolReference(onClick);

    return (
        <Node>
            <MuiButton
                size={size as any}
                variant={variant}
                color={color}
                disabled={disabled}
                disableElevation={disableElevation}
                disableFocusRipple={disableFocusRipple}
                disableRipple={disableRipple}
                onClick={handleClick}
            >
                {text}
            </MuiButton>
        </Node>
    );
};

const defaultProps: IButtonProps = {
    size: "small",
    variant: "contained",
    color: "primary",
    text: "CLICK ME",
    disabled: false,
    disableElevation: false,
    disableFocusRipple: false,
    disableRipple: false,
    onClick: undefined,
};

ButtonNode.defaultProps = defaultProps;

ButtonNode.craft = {
    props: defaultProps,
    related: {
        settings: () => (
            <PropertiesForm
                groups={[
                    {
                        title: "General",
                        fields: [
                            {
                                id: "id",
                                title: "ID",
                                type: "text",
                                size: "small",
                                help: "The identifier of the button.",
                                required: true,
                            },
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
                                id: "onClick",
                                size: "small",
                                help: "The name of the callback to invoke on click.",
                                type: "handler",
                                required: true,
                                title: "On Click",
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

export default ButtonNode;
