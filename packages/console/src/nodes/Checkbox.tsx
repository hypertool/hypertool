import type { ReactElement } from "react";

import {
    FormControlLabel,
    FormGroup,
    Checkbox as MuiCheckbox,
} from "@mui/material";

import { useNode } from "../craft";
import { useArtifactReference } from "../hooks";
import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type {
    BaseColor,
    CheckboxSize,
    CraftComponent,
    ISymbolReference,
} from "../types";

interface Props {
    label?: string;
    color?: BaseColor;
    disabled?: boolean;
    checked?: boolean;
    disableRipple?: boolean;
    onChange?: ISymbolReference;
    size?: CheckboxSize;
}

export const Checkbox: CraftComponent<Props> = (props: Props): ReactElement => {
    const { label, color, disabled, checked, disableRipple, onChange, size } =
        props;
    const {
        connectors: { connect, drag },
    } = useNode();
    const handleClick = useArtifactReference(onChange);
    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <FormGroup>
                <FormControlLabel
                    label={label as any}
                    disabled={disabled}
                    control={
                        <MuiCheckbox
                            color={color}
                            size={size}
                            checked={checked}
                            disableRipple={disableRipple}
                            onChange={handleClick}
                        />
                    }
                />
            </FormGroup>
        </div>
    );
};

const defaultProps: Props = {
    size: "small",
    checked: false,
    color: "primary",
    disabled: false,
    disableRipple: false,
    onChange: undefined,
    label: "Label",
};

Checkbox.craft = {
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
                                help: "The size of the checkbox.",
                                type: "select",
                                required: true,
                                title: "Size",
                                options: [
                                    { value: "small", title: "Small" },
                                    { value: "medium", title: "Medium" },
                                ],
                            },
                            {
                                id: "checked",
                                title: "Checked",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the checkbox is checked by default, or not.",
                            },
                            {
                                id: "label",
                                title: "Label",
                                type: "text",
                                size: "small",
                                help: "Label for the checkbox",
                            },
                            {
                                id: "disabled",
                                title: "Disabled",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the checkbox is disabled, or not.",
                            },
                            //TODO change this when color component is implemented
                            {
                                id: "color",
                                size: "small",
                                help: "The color of the checkbox.",
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
                            {
                                id: "disableRipple",
                                title: "Disable Ripple",
                                type: "switch",
                                size: "small",
                                help: "Determines whether a ripple effect is rendered or not when the checkbox is clicked.",
                            },
                            {
                                id: "onChange",
                                size: "small",
                                help: "The name of the callback to invoke on change.",
                                type: "handler",
                                required: true,
                                title: "On Change",
                            },
                        ],
                    },
                ]}
                validationSchema={undefined}
            />
        ),
    },
};
