import { ReactElement } from "react";

import { useNode } from "@craftjs/core";

import PropertiesForm from "../layouts/app-builder/panels/properties-editor/PropertiesForm";
import { CraftComponent } from "../types";

export interface Props {
    disabled?: boolean;
    background?: string | number;
    paddingLeft?: string | number;
    paddingRight?: string | number;
    paddingTop?: string | number;
    paddingBottom?: string | number;
    children?: ReactElement;
    direction?: "row" | "row-reverse" | "column" | "column-reverse";
    wrap?: "nowrap" | "wrap" | "wrap-reverse";
    justifyContent?:
        | "flex-start"
        | "flex-end"
        | "center"
        | "space-between"
        | "space-around"
        | "space-evenly";
    alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
    gap?: string | number;
    rowGap?: string | number;
    columnGap?: string | number;
}

const FlexLayout: CraftComponent<Props> = (props: Props): ReactElement => {
    const {
        connectors: { connect, drag },
    } = useNode();
    const {
        disabled,
        background,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        children,
        direction,
        wrap,
        justifyContent,
        alignItems,
        gap,
        rowGap,
        columnGap,
    } = props;

    return (
        <div ref={(ref: any) => connect(drag(ref as any))}>
            <div
                style={{
                    pointerEvents: disabled ? "none" : undefined,
                    display: "flex",
                    flexDirection: direction,
                    background,
                    paddingTop: parseInt(paddingTop as any, 10),
                    paddingRight: parseInt(paddingRight as any, 10),
                    paddingBottom: parseInt(paddingBottom as any, 10),
                    paddingLeft: parseInt(paddingLeft as any, 10),
                    width: 400,
                    height: 400,
                    flexWrap: wrap,
                    justifyContent,
                    alignItems,
                    gap: parseInt(gap as any, 10),
                    rowGap: parseInt(rowGap as any, 10),
                    columnGap: parseInt(columnGap as any, 10),
                }}
            >
                {children}
            </div>
        </div>
    );
};

const defaultProps = {
    disabled: false,
    background: "#ffffff",
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    direction: "row",
    wrap: "nowrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 0,
    rowGap: 0,
    columnGap: 0,
};

FlexLayout.craft = {
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
                                help: "Determines wether the layout is disabled, or not.",
                            },
                            {
                                id: "background",
                                title: "Background",
                                type: "text",
                                size: "small",
                                help: "The background color of the component.",
                            },
                            {
                                id: "paddingLeft",
                                title: "Padding Left",
                                type: "text",
                                size: "small",
                                help: "The left padding of the component.",
                            },
                            {
                                id: "paddingTop",
                                title: "Padding Top",
                                type: "text",
                                size: "small",
                                help: "The top padding of the component.",
                            },
                            {
                                id: "paddingBottom",
                                title: "Padding Bottom",
                                type: "text",
                                size: "small",
                                help: "The bottom padding of the component.",
                            },
                            {
                                id: "paddingRight",
                                title: "Padding Right",
                                type: "text",
                                size: "small",
                                help: "The right padding of the component.",
                            },
                            {
                                id: "direction",
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
                                id: "wrap",
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
                                id: "justifyContent",
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
                                id: "alignItems",
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
                                id: "gap",
                                title: "Gap",
                                type: "number",
                                size: "small",
                                help: "The space between the items.",
                            },
                            {
                                id: "rowGap",
                                title: "Row Gap",
                                type: "number",
                                size: "small",
                                help: "The space between the rows.",
                            },
                            {
                                id: "columnGap",
                                title: "Column Gap",
                                type: "number",
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

export default FlexLayout;
