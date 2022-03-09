import type { ReactElement } from "react";

import { Typography as MuiTypography } from "@mui/material";

import { useNode } from "@craftjs/core";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type {
    BaseColor,
    CraftComponent,
    TypoGraphyVariant,
    TypographyAlign,
} from "../types";

interface Props {
    text?: string;
    color?: BaseColor | string;
    align?: TypographyAlign;
    gutterBottom?: boolean;
    noWrap?: boolean;
    variant?: TypoGraphyVariant;
}

export const Typography: CraftComponent<Props> = (
    props: Props,
): ReactElement => {
    const { text, color, align, gutterBottom, noWrap, variant } = props;
    const {
        connectors: { connect, drag },
    } = useNode();
    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <MuiTypography
                variant={variant}
                component={variant as any}
                color={color}
                align={align}
                gutterBottom={gutterBottom}
                noWrap={noWrap}
            >
                {text}
            </MuiTypography>
        </div>
    );
};

const defaultProps: Props = {
    text: "your text",
    color: "primary",
    align: "center",
    gutterBottom: false,
    noWrap: false,
    variant: "body1",
};

Typography.craft = {
    props: defaultProps,
    related: {
        settings: () => (
            <PropertiesForm
                groups={[
                    {
                        title: "General",
                        fields: [
                            {
                                id: "text",
                                title: "Text",
                                type: "large_text",
                                size: "small",
                                help: "Text which goes inside typography.",
                            },
                            {
                                id: "color",
                                size: "small",
                                help: "The color of the typography.",
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
                                id: "align",
                                size: "small",
                                help: "The align of the typography.",
                                type: "select",
                                required: true,
                                title: "Align",
                                options: [
                                    { value: "center", title: "Center" },
                                    { value: "inherit", title: "Inherit" },
                                    { value: "justify", title: "Justify" },
                                    { value: "left", title: "Left" },
                                    { value: "right", title: "Right" },
                                ],
                            },
                            {
                                id: "gutterBottom",
                                title: "Gutter Bottom",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the typography is gutterBottom by default, or not.",
                            },
                            {
                                id: "noWrap",
                                title: "No Wrap",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the typography is noWrap by default, or not.",
                            },
                            {
                                id: "variant",
                                size: "small",
                                help: "The variant of the typography.",
                                type: "select",
                                required: true,
                                title: "Variant",
                                options: [
                                    { value: "body1", title: "body1" },
                                    { value: "body2", title: "body2" },
                                    { value: "button", title: "button" },
                                    { value: "caption", title: "caption" },
                                    { value: "h1", title: "h1" },
                                    { value: "h2", title: "h2" },
                                    { value: "h3", title: "h3" },
                                    { value: "h4", title: "h4" },
                                    { value: "h5", title: "h5" },
                                    { value: "h6", title: "h6" },
                                    { value: "overline", title: "overline" },
                                    { value: "inherit", title: "inherit" },
                                    { value: "subtitle1", title: "subtitle1" },
                                    { value: "subtitle2", title: "subtitle2" },
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
