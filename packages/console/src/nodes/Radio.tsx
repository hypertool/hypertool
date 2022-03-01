import type { ReactElement } from "react";

import { FormControlLabel, Radio as MuiRadio } from "@mui/material";

import { useNode } from "@craftjs/core";

import { useArtifactReference } from "../hooks";
import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type {
    BaseColor,
    CheckboxSize,
    CraftComponent,
    IArtifactReference,
    LabelPlacement,
} from "../types";

interface Props {
    color?: BaseColor;
    label?: string;
    size?: CheckboxSize;
    onChange?: IArtifactReference;
    value?: string;
    labelPlacement?: LabelPlacement;
}

export const Radio: CraftComponent<Props> = (props: Props): ReactElement => {
    const { color, label, size, onChange, value, labelPlacement } = props;
    const {
        connectors: { connect, drag },
    } = useNode();
    const handleChange = useArtifactReference(onChange);
    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <FormControlLabel
                value={value}
                label={label as any}
                control={
                    <MuiRadio
                        onChange={handleChange}
                        name="radio-buttons"
                        size={size}
                        color={color}
                        inputProps={{ "aria-label": { value } as any }}
                    />
                }
                labelPlacement={labelPlacement}
            />
        </div>
    );
};

const defaultProps: Props = {
    color: "primary",
    label: "Label",
    size: "small",
    onChange: undefined,
    value: "",
    labelPlacement: "end",
};

Radio.defaultProps = defaultProps;

Radio.craft = {
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
                                help: "The size of the radio.",
                                type: "select",
                                required: true,
                                title: "Size",
                                options: [
                                    { value: "small", title: "Small" },
                                    { value: "medium", title: "Medium" },
                                ],
                            },
                            {
                                id: "label",
                                title: "Label",
                                type: "text",
                                size: "small",
                                help: "Label for the radio",
                            },
                            {
                                id: "value",
                                title: "Value",
                                type: "text",
                                size: "small",
                                help: "Value for the radio",
                            },
                            //TODO change this when color component is implemented
                            {
                                id: "color",
                                size: "small",
                                help: "The color of the radio.",
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
                                id: "labelPlacement",
                                size: "small",
                                help: "The size of the radio.",
                                type: "select",
                                required: true,
                                title: "Label Placement",
                                options: [
                                    { value: "top", title: "Top" },
                                    { value: "bottom", title: "Bottom" },
                                    { value: "start", title: "Start" },
                                    { value: "end", title: "End" },
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
