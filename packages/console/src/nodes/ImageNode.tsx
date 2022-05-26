import type { ReactElement } from "react";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import { CraftComponent } from "../types";

import Image, { IImageProps } from "./Image";
import Node from "./Node";

const ImageNode: CraftComponent<IImageProps> = (
    props: IImageProps,
): ReactElement => {
    return (
        <Node>
            <Image {...props} />
        </Node>
    );
};

ImageNode.defaultProps = {
    source: "https://res.cloudinary.com/hypertool/image/upload/v1649820987/hypertool-assets/empty-apps_ok9nbh.svg",
    width: "400px",
    height: "400px",
};

ImageNode.craft = {
    props: ImageNode.defaultProps,
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
                            {
                                id: "source",
                                size: "small",
                                help: "The source of the image to display.",
                                type: "text",
                                required: true,
                                title: "Source",
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
                ]}
                validationSchema={undefined}
            />
        ),
    },
};

export default ImageNode;
