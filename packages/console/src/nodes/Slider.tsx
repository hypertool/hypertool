import { ReactElement } from "react";

import { FormGroup, Slider as MuiSlider } from "@mui/material";

import { useNode } from "@craftjs/core";

import { useArtifactReference } from "../hooks";
import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type {
    BaseColor,
    CraftComponent,
    IArtifactReference,
    SliderSize,
    SliderValueLabelDisplay,
} from "../types";

interface Props {
    color?: BaseColor;
    marks?: boolean;
    step?: number;
    valueLabelDisplay?: SliderValueLabelDisplay;
    onChange?: IArtifactReference;
    size?: SliderSize;
}

export const Slider: CraftComponent<Props> = (props: Props): ReactElement => {
    const { color, marks, step, valueLabelDisplay, onChange, size } = props;
    const {
        connectors: { connect, drag },
    } = useNode();
    const handleChange = useArtifactReference(onChange);

    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <FormGroup>
                <MuiSlider
                    color={color as any}
                    marks={marks}
                    step={step}
                    valueLabelDisplay={valueLabelDisplay}
                    onChange={handleChange}
                    size={size}
                />
            </FormGroup>
        </div>
    );
};

const defaultProps: Props = {
    size: "small",
    color: "primary",
    onChange: undefined,
    valueLabelDisplay: "auto",
};

Slider.craft = {
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
                                help: "The size of the Slider.",
                                type: "select",
                                required: true,
                                title: "Size",
                                options: [
                                    { value: "small", title: "Small" },
                                    { value: "medium", title: "Medium" },
                                ],
                            },
                            {
                                id: "marks",
                                title: "Marks",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the slider has marks or not.",
                            },
                            {
                                id: "step",
                                size: "small",
                                help: "Determines the slider step increment.",
                                type: "number",
                                required: true,
                                title: "Step",
                            },
                            {
                                id: "valueLabelDisplay",
                                size: "small",
                                help: "Determines whether the slider label is visible or not",
                                type: "select",
                                required: true,
                                title: "Value Label Display",
                                options: [
                                    { value: "on", title: "on" },
                                    { value: "auto", title: "auto" },
                                    { value: "off", title: "off" },
                                ],
                            },
                            {
                                id: "color",
                                size: "small",
                                help: " The color of the slider.",
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
