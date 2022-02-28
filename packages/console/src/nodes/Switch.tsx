import type { ReactElement } from "react";

import { Switch as MuiSwitch } from "@mui/material";

import { useNode } from "@craftjs/core";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type { CraftComponent, SwitchColor, SwitchSize } from "../types";

interface Props {
    color?: SwitchColor;
    disabled?: boolean;
    checked?: boolean;
    disableRipple?: boolean;
    // onChange?:
    size?: SwitchSize;
}

export const Switch: CraftComponent<Props> = (props: Props): ReactElement => {
    const { size, color, disabled, checked, disableRipple } = props;
    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <MuiSwitch
                size={size as any}
                disabled={disabled}
                checked={checked}
                disableRipple={disableRipple}
                color={color}></MuiSwitch>
        </div>
    );
};

const defaultProps: Props = {
    size: "small",
    color: "primary",
    disabled: false,
    checked: true,
    disableRipple: false,
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
                                help: "Determines wether the switch is disabled, or not.",
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
                        ],
                    },
                ]}
                validationSchema={undefined}
            />
        ),
    },
};
