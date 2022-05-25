import type { ReactElement } from "react";

import { TextField as MuiTextField } from "@mui/material";

import { useSymbolReference } from "../hooks";
import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type { Color, CraftComponent, ISymbolReference } from "../types";

import Node from "./Node";

export interface ITextFieldProps {
    id?: string;
    autoFocus?: boolean;
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
    defaultValue?: string;
    disabled?: boolean;
    error?: boolean;
    fullWidth?: boolean;
    helperText?: string;
    label?: string;
    margin?: "dense" | "none" | "normal";
    maxRows?: number;
    multiline?: boolean;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    size?: "medium" | "small";
    variant?: "filled" | "outlined" | "standard";
    onChange?: ISymbolReference;
    onClick?: ISymbolReference;
}

const TextFieldNode: CraftComponent<ITextFieldProps> = (
    props: ITextFieldProps,
): ReactElement => {
    const {
        autoFocus,
        color,
        defaultValue,
        disabled,
        error,
        fullWidth,
        helperText,
        label,
        margin,
        maxRows,
        multiline,
        placeholder,
        required,
        rows,
        size,
        variant,
    } = props;

    return (
        <Node>
            <MuiTextField
                autoFocus={autoFocus}
                color={color}
                defaultValue={defaultValue}
                disabled={disabled}
                error={error}
                fullWidth={fullWidth}
                helperText={helperText}
                label={label}
                margin={margin}
                maxRows={maxRows}
                multiline={multiline}
                placeholder={placeholder}
                required={required}
                rows={rows}
                size={size}
                variant={variant}
            />
        </Node>
    );
};

const defaultProps: ITextFieldProps = {
    id: undefined,
    autoFocus: false,
    color: "primary",
    defaultValue: "",
    disabled: false,
    error: false,
    fullWidth: false,
    helperText: "",
    label: "Label",
    margin: "dense",
    maxRows: undefined,
    multiline: false,
    placeholder: "",
    required: false,
    rows: undefined,
    size: "small",
    variant: "outlined",
    onChange: undefined,
    onClick: undefined,
};

TextFieldNode.defaultProps = defaultProps;

TextFieldNode.craft = {
    props: defaultProps,
    related: {
        settings: () => (
            <PropertiesForm
                groups={[
                    {
                        id: "general",
                        title: "General",
                        fields: [
                            {
                                id: "id",
                                title: "ID",
                                type: "text",
                                size: "small",
                                help: "The identifier of the text field.",
                                required: true,
                            },
                            {
                                id: "autoFocus",
                                title: "Auto Focus",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the text field is focused during the first mount.",
                                required: true,
                            },
                            {
                                id: "color",
                                title: "Color",
                                type: "select",
                                size: "small",
                                help: "The color of the text field.",
                                required: true,
                                options: [
                                    { value: "primary", title: "Primary" },
                                    { value: "secondary", title: "Secondary" },
                                    { value: "error", title: "Error" },
                                    { value: "info", title: "Info" },
                                    { value: "success", title: "Success" },
                                    { value: "warning", title: "Warning" },
                                ],
                            },
                            {
                                id: "defaultValue",
                                title: "Default Value",
                                type: "text",
                                size: "small",
                                help: "The default value of the text field. It is used when the text field is not controlled.",
                                required: true,
                            },
                            {
                                id: "disabled",
                                title: "Disabled",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the text field is disabled.",
                                required: true,
                            },
                            {
                                id: "error",
                                title: "Error",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the text field state is erroneous.",
                                required: true,
                            },
                            {
                                id: "fullWidth",
                                title: "Full Width",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the text field will take up the full width of its contianer.",
                                required: false,
                            },
                            {
                                id: "helperText",
                                title: "Helper Text",
                                type: "text",
                                size: "small",
                                help: "The helper text of the text field.",
                                required: true,
                            },
                            {
                                id: "label",
                                title: "Label",
                                type: "text",
                                size: "small",
                                help: "The label of the text field.",
                                required: true,
                            },
                            {
                                id: "margin",
                                title: "Margin",
                                type: "select",
                                size: "small",
                                help: "The vertical spacing of text field.",
                                required: true,
                                options: [
                                    { value: "dense", title: "Dense" },
                                    { value: "none", title: "None" },
                                    { value: "normal", title: "Normal" },
                                ],
                            },
                            {
                                id: "maxRows",
                                title: "Max Rows",
                                type: "text",
                                size: "small",
                                help: "The maximum number of rows to display when the text field is multiline.",
                                required: true,
                            },
                            {
                                id: "multiline",
                                title: "Multiline",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the text field accepts multiple lines of input.",
                                required: false,
                            },
                            {
                                id: "placeholder",
                                title: "Placeholder",
                                type: "text",
                                size: "small",
                                help: "The hint displayed inside the text field before the user enters a value.",
                                required: true,
                            },
                            {
                                id: "required",
                                title: "Required",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the text field is required.",
                                required: false,
                            },
                            {
                                id: "rows",
                                title: "Rows",
                                type: "text",
                                size: "small",
                                help: "The number of rows to display when the text field is multiline.",
                                required: true,
                            },
                            {
                                id: "size",
                                title: "Size",
                                type: "select",
                                size: "small",
                                help: "The size of the text field.",
                                required: true,
                                options: [
                                    { value: "medium", title: "Medium" },
                                    { value: "small", title: "Small" },
                                ],
                            },
                            {
                                id: "variant",
                                title: "Variant",
                                type: "select",
                                size: "small",
                                help: "The variant of the text field.",
                                required: true,
                                options: [
                                    { value: "filled", title: "Filled" },
                                    { value: "outlined", title: "Outlined" },
                                    { value: "standard", title: "Standard" },
                                ],
                            },
                            {
                                id: "onClick",
                                size: "small",
                                help: "The name of the callback to invoke on click.",
                                type: "handler",
                                required: true,
                                title: "On Click",
                            },
                        ],
                    },
                ]}
                validationSchema={undefined}
            />
        ),
    },
};

export default TextFieldNode;
