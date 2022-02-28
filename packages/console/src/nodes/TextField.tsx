import { ReactElement } from "react";
import { useState } from "react";

import { TextField as MuiTextField, FormControl } from "@mui/material";

import { useNode } from "@craftjs/core";

import PropertiesForm from "../layouts/app-builder/panels/properties-editor/PropertiesForm";
import type {
    TextColor,
    CraftComponent,
    TextMargin,
    TextSize,
    TextVarient,
} from "../types";

interface Props {
    disabled?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    startAdornment?: string;
    endAdornment?: string;
    variant?: TextVarient;
    margin?: TextMargin;
    size?: TextSize;
    color?: TextColor;
}

export const TextField: CraftComponent<Props> = (
    props: Props,
): ReactElement => {
    const { disabled, required, fullWidth, variant, margin, size, color } =
        props;
    const [value, setValue] = useState<string>("");

    const handleChange = (event: any) => {
        setValue(event.target.value);
    };

    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <FormControl variant={variant} sx={{ m: 1, minWidth: 120 }}>
                <MuiTextField
                    id="outlined-basic"
                    label="Outlined"
                    variant={variant}
                    required={required}
                    disabled={disabled}
                    fullWidth={fullWidth}
                    margin={margin}
                    onChange={handleChange}
                    value={value}
                    color={color}
                    size={size}
                />
            </FormControl>
        </div>
    );
};

const defaultProps: Props = {
    size: "medium",
    variant: "standard",
    margin: "normal",
    color: "primary",

    /* startAdornment: "",
    endAndornment: "", */
};

TextField.craft = {
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
                                help: "Input is disabled or not.",
                            },
                            {
                                id: "required",
                                title: "Required",
                                type: "switch",
                                size: "small",
                                help: "Input is require or not",
                            },
                            {
                                id: "fullWidth",
                                title: "Full Width",
                                type: "switch",
                                size: "small",
                                help: "Full Width of the input field",
                                required: true,
                            },
                            {
                                id: "size",
                                size: "small",
                                help: "The size of the input filed.",
                                type: "select",
                                required: true,
                                title: "Size",
                                options: [
                                    { value: "small", title: "Small" },
                                    { value: "normal", title: "Normal" },
                                ],
                            },
                            {
                                id: "variant",
                                size: "small",
                                help: "The variant of the input field.",
                                type: "select",
                                required: true,
                                title: "Variant",
                                options: [
                                    { value: "filled", title: "filled" },
                                    { value: "standard", title: "standard" },
                                    { value: "outlined", title: "outlined" },
                                ],
                            },
                            {
                                id: "margin",
                                title: "Margin",
                                type: "select",
                                required: true,
                                size: "small",
                                options: [
                                    { value: "none", title: "none" },
                                    { value: "dense", title: "dense" },
                                    { value: "normal", title: "normal" },
                                ],
                                help: "Select the margin of the text field",
                            },
                            {
                                id: "color",
                                size: "small",
                                help: "The color of the input field.",
                                type: "select",
                                required: true,
                                title: "Color",
                                options: [
                                    { value: "primary", title: "Primary" },
                                    { value: "secondary", title: "Secondary" },
                                    { value: "success", title: "Success" },
                                    { value: "error", title: "Error" },
                                    { value: "info", title: "Info" },
                                    { value: "warning", title: "Warning" },
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
