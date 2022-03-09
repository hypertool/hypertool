import type { ReactElement } from "react";

import { FormGroup, Icon as MuiIcon } from "@mui/material";

import { useNode } from "@craftjs/core";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type { CraftComponent, IconColor, IconFontSize } from "../types";

interface Props {
    color?: IconColor;
    fontSize?: IconFontSize | string;
}

export const Icon: CraftComponent<Props> = (props: Props): ReactElement => {
    const { color, fontSize } = props;

    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <div ref={(ref) => connect(drag(ref as any))}>
                <FormGroup>
                    <MuiIcon color={color} fontSize={fontSize as any} />
                </FormGroup>
            </div>
        </div>
    );
};

const defaultProps: Props = {
    color: "inherit",
    fontSize: "24px",
};

Icon.craft = {
    props: defaultProps,
    related: {
        settings: () => (
            <PropertiesForm
                groups={[
                    {
                        title: "General",
                        fields: [
                            {
                                id: "fontSize",
                                size: "small",
                                help: " The size of the icon",
                                type: "select",
                                required: true,
                                title: "Font Size",
                                options: [
                                    {
                                        value: "inherit",
                                        title: "determinate",
                                    },
                                    {
                                        value: "large",
                                        title: "large",
                                    },
                                    {
                                        value: "medium",
                                        title: "medium",
                                    },
                                    {
                                        value: "small",
                                        title: "small",
                                    },
                                ],
                            },
                            {
                                id: "color",
                                size: "small",
                                help: "  The color of the Icon button.",
                                type: "select",
                                required: true,
                                title: "Color",
                                options: [
                                    { value: "inherit", title: "Inherit" },
                                    { value: "action", title: "Action" },
                                    { value: "disabled", title: "Disabled" },
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
