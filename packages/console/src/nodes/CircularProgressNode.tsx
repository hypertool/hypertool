import type { ReactElement } from "react";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import { CraftComponent } from "../types";

import CircularProgress, { ICircularProgressProps } from "./CircularProgress";
import Node from "./Node";

const CircularProgressNode: CraftComponent<ICircularProgressProps> = (
    props: ICircularProgressProps,
): ReactElement => {
    return (
        <Node>
            <CircularProgress {...props} />
        </Node>
    );
};

CircularProgressNode.craft = {
    props: CircularProgress.defaultProps,
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
                                help: "The identifier of the table cell.",
                                required: false,
                            },
                            {
                                id: "color",
                                title: "Color",
                                type: "select",
                                size: "small",
                                help: "The color of the circular progress.",
                                required: false,
                                options: [
                                    { value: "inherit", title: "Inherit" },
                                    { value: "primary", title: "Primary" },
                                    { value: "secondary", title: "Secondary" },
                                    { value: "error", title: "Error" },
                                    { value: "info", title: "Info" },
                                    { value: "success", title: "Success" },
                                    { value: "warning", title: "Warning" },
                                ],
                            },
                            {
                                id: "disableShrink",
                                title: "Disable Shrink",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the shrink animation is disabled. It works only when the variant is indeterminate.",
                            },
                            {
                                id: "size",
                                title: "Size",
                                type: "text",
                                size: "small",
                                help: "The size of the circular progress.",
                            },
                            {
                                id: "thickness",
                                title: "Thickness",
                                type: "number",
                                size: "small",
                                help: "The thickness of the circular progress.",
                            },
                            {
                                id: "value",
                                title: "Value",
                                type: "number",
                                size: "small",
                                help: "The value of the circular progress between 1 to 100. It works only when the variant is determinate.",
                            },
                            {
                                id: "variant",
                                title: "Variant",
                                type: "select",
                                size: "small",
                                help: "The variant of the circular progress.",
                                options: [
                                    {
                                        value: "determinate",
                                        title: "Determinate",
                                    },
                                    {
                                        value: "indeterminate",
                                        title: "Indeterminate",
                                    },
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

export default CircularProgressNode;
