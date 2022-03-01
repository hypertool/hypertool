import type { ReactElement } from "react";

import { FormGroup, Switch as MuiSwitch } from "@mui/material";

import { useNode } from "@craftjs/core";

import { useArtifactReference } from "../hooks";
import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type {
    CraftComponent,
    IArtifactReference,
    SwitchColor,
    SwitchSize,
} from "../types";

interface Props {
    label?: string;
    color?: SwitchColor;
    disabled?: boolean;
    checked?: boolean;
    disableRipple?: boolean;
    onChange?: IArtifactReference;
    size?: SwitchSize;
}

export const Switch: CraftComponent<Props> = (props: Props): ReactElement => {
    const { size, color, disabled, checked, disableRipple, onChange } = props;
    const {
        connectors: { connect, drag },
    } = useNode();

    const handleClick = useArtifactReference(onChange);

    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <FormGroup sx={{ m: 1, minWidth: 120 }}>
                <MuiSwitch
                    size={size as any}
                    disabled={disabled}
                    checked={checked}
                    disableRipple={disableRipple}
                    color={color}
                    onChange={handleClick}
                />
            </FormGroup>
        </div>
    );
};

const defaultProps: Props = {
    size: "small",
    color: "primary",
    disabled: false,
    disableRipple: false,
    onChange: undefined,
};

Switch.defaultProps = defaultProps;

Switch.craft = {
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
                                help: "Determines whether the switch is disabled, or not.",
                            },
                            {
                                id: "checked",
                                title: "Checked",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the Switch is checked or not.",
                            },
                            {
                                id: "disableRipple",
                                title: "Disable Ripple",
                                type: "switch",
                                size: "small",
                                help: "Determines whether a ripple effect is rendered or not when the switch is clicked.",
                            },
                            {
                                id: "size",
                                size: "small",
                                help: "The size of the switch.",
                                type: "select",
                                required: true,
                                title: "Size",
                                options: [
                                    { value: "small", title: "Small" },
                                    { value: "medium", title: "Medium" },
                                ],
                            },
                            {
                                id: "color",
                                size: "small",
                                help: "The color of the switch.",
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
