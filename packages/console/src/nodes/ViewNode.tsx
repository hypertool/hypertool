import type { ReactElement } from "react";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import { CraftComponent } from "../types";

import Node from "./Node";
import View, { IProps } from "./View";

const ViewNode: CraftComponent<IProps> = (props: IProps): ReactElement => {
    const { children } = props;
    return (
        <Node>
            <View {...props}>{children}</View>
        </Node>
    );
};

ViewNode.defaultProps = {
    height: "400px",
    width: "400px",
    backgroundColor: "white",
};

ViewNode.craft = {
    props: ViewNode.defaultProps,
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
                                size: "small",
                                help: "An identifier that uniquely identifies the node.",
                                type: "text",
                                required: true,
                                title: "ID",
                            },
                        ],
                    },
                    {
                        id: "backdrop",
                        title: "Backdrop",
                        fields: [
                            {
                                id: "backdropFilterBlur",
                                size: "small",
                                help: "Blurs the image.",
                                type: "text",
                                title: "Blur",
                            },
                            {
                                id: "backdropFilterBrightness",
                                size: "small",
                                help: "Makes the image brighter or darker.",
                                type: "text",
                                title: "Brightness",
                            },
                            {
                                id: "backdropFilterContrast",
                                size: "small",
                                help: "Increases or decreases the image's contrast.",
                                type: "text",
                                title: "Contrast",
                            },
                            {
                                id: "backdropFilterDropShadow",
                                size: "small",
                                help: "Applies a drop shadow behind the image.",
                                type: "text",
                                title: "Drop Shadow",
                            },
                            {
                                id: "backdropFilterGrayscale",
                                size: "small",
                                help: "Converts the image to grayscale.",
                                type: "text",
                                title: "Grayscale",
                            },
                            {
                                id: "backdropFilterHueRotate",
                                size: "small",
                                help: "Changes the overall hue of the image.",
                                type: "text",
                                title: "Hue Rotate",
                            },
                            {
                                id: "backdropFilterInvert",
                                size: "small",
                                help: "Inverts the colors of the image.",
                                type: "text",
                                title: "Invert",
                            },
                            {
                                id: "backdropFilterOpacity",
                                size: "small",
                                help: "Makes the image transparent.",
                                type: "text",
                                title: "Opacity",
                            },
                            {
                                id: "backdropFilterSaturate",
                                size: "small",
                                help: "Super-saturates or desaturates the input image.",
                                type: "text",
                                title: "Saturate",
                            },
                            {
                                id: "backdropFilterSepia",
                                size: "small",
                                help: "Converts the image to sepia.",
                                type: "text",
                                title: "Sepia",
                            },
                        ],
                    },
                    {
                        id: "dimensions",
                        title: "Dimensions",
                        fields: [
                            {
                                id: "width",
                                size: "small",
                                help: "The width of the view.",
                                type: "text",
                                required: true,
                                title: "Width",
                            },
                            {
                                id: "height",
                                size: "small",
                                help: "The height of the view.",
                                type: "text",
                                required: true,
                                title: "Height",
                            },
                            {
                                id: "minWidth",
                                size: "small",
                                help: "The minimum width of the view.",
                                type: "text",
                                title: "Min Width",
                            },
                            {
                                id: "minHeight",
                                size: "small",
                                help: "The minimum height of the view.",
                                type: "text",
                                title: "Min Height",
                            },
                            {
                                id: "maxWidth",
                                size: "small",
                                help: "The maximum width of the view.",
                                type: "text",
                                title: "Max Width",
                            },
                            {
                                id: "maxHeight",
                                size: "small",
                                help: "The maximum height of the view.",
                                type: "text",
                                title: "Max Height",
                            },
                        ],
                    },
                    {
                        id: "background",
                        title: "Background",
                        fields: [
                            {
                                id: "backgroundColor",
                                size: "small",
                                help: "The background color of the view.",
                                type: "text",
                                title: "Background Color",
                            },
                            {
                                id: "backgroundAttachment",
                                size: "small",
                                help: "Determines whether a background image's position is fixed within the viewport, or scrolls with its containing block.",
                                type: "select",
                                title: "Attachment",
                                options: [
                                    { value: "fixed", title: "Fixed" },
                                    {
                                        value: "local",
                                        title: "Local",
                                    },
                                    { value: "scroll", title: "Scroll" },
                                ],
                            },
                        ],
                    },
                    {
                        id: "margin",
                        title: "Margin",
                        fields: [
                            {
                                id: "marginTop",
                                title: "Margin Top",
                                type: "text",
                                size: "small",
                                help: "The top margin of the component.",
                            },
                            {
                                id: "marginRight",
                                title: "Margin Right",
                                type: "text",
                                size: "small",
                                help: "The right margin of the component.",
                            },
                            {
                                id: "marginBottom",
                                title: "Margin Bottom",
                                type: "text",
                                size: "small",
                                help: "The bottom margin of the component.",
                            },
                            {
                                id: "marginLeft",
                                title: "Margin Left",
                                type: "text",
                                size: "small",
                                help: "The left margin of the component.",
                            },
                        ],
                    },
                    {
                        id: "padding",
                        title: "Padding",
                        fields: [
                            {
                                id: "paddingTop",
                                title: "Padding Top",
                                type: "text",
                                size: "small",
                                help: "The top padding of the component.",
                            },
                            {
                                id: "paddingRight",
                                title: "Padding Right",
                                type: "text",
                                size: "small",
                                help: "The right padding of the component.",
                            },
                            {
                                id: "paddingBottom",
                                title: "Padding Bottom",
                                type: "text",
                                size: "small",
                                help: "The bottom padding of the component.",
                            },
                            {
                                id: "paddingLeft",
                                title: "Padding Left",
                                type: "text",
                                size: "small",
                                help: "The left padding of the component.",
                            },
                        ],
                    },
                    {
                        id: "layout",
                        title: "Layout",
                        fields: [
                            {
                                id: "flexDirection",
                                size: "small",
                                help: "The direction of the layout.",
                                type: "select",
                                required: true,
                                title: "Direction",
                                options: [
                                    { value: "row", title: "Row" },
                                    {
                                        value: "row-reverse",
                                        title: "Row Reverse",
                                    },
                                    { value: "column", title: "Column" },
                                    {
                                        value: "column-reverse",
                                        title: "Column Reverse",
                                    },
                                ],
                            },
                            {
                                id: "flexWrap",
                                size: "small",
                                help: "The wrapping behavior of the layout.",
                                type: "select",
                                required: true,
                                title: "Wrap",
                                options: [
                                    { value: "nowrap", title: "No Wrap" },
                                    {
                                        value: "wrap",
                                        title: "Wrap",
                                    },
                                    {
                                        value: "wrap-reverse",
                                        title: "Wrap Reverse",
                                    },
                                ],
                            },
                            {
                                id: "flexMainAxisAlignment",
                                size: "small",
                                help: "The alignment along the main axis.",
                                type: "select",
                                required: true,
                                title: "Main Axis Alignment",
                                options: [
                                    { value: "flex-start", title: "Start" },
                                    { value: "flex-end", title: "End" },
                                    { value: "center", title: "Center" },
                                    {
                                        value: "space-between",
                                        title: "Space Between",
                                    },
                                    {
                                        value: "space-around",
                                        title: "Space Around",
                                    },
                                    {
                                        value: "space-evenly",
                                        title: "Space Evenly",
                                    },
                                ],
                            },
                            {
                                id: "flexCrossAxisAlignment",
                                size: "small",
                                help: "The alignment along the cross axis.",
                                type: "select",
                                required: true,
                                title: "Cross Axis Alignment",
                                options: [
                                    { value: "flex-start", title: "Start" },
                                    { value: "flex-end", title: "End" },
                                    { value: "center", title: "Center" },
                                    {
                                        value: "stretch",
                                        title: "Stretch",
                                    },
                                    {
                                        value: "baseline",
                                        title: "Baseline",
                                    },
                                ],
                            },
                            {
                                id: "flexGap",
                                title: "Gap",
                                type: "text",
                                size: "small",
                                help: "The space between the items.",
                            },
                            {
                                id: "flexRowGap",
                                title: "Row Gap",
                                type: "text",
                                size: "small",
                                help: "The space between the rows.",
                            },
                            {
                                id: "flexColumnGap",
                                title: "Column Gap",
                                type: "text",
                                size: "small",
                                help: "The space between the columns.",
                            },
                        ],
                    },
                ]}
                validationSchema={undefined}
            />
        ),
    },
};

export default ViewNode;
