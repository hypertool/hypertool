import type { ReactElement } from "react";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type { CraftComponent } from "../types";

import Node from "./Node";
import TableCell, { ITableCellProps } from "./TableCell";

const TableCellNode: CraftComponent<ITableCellProps> = (
    props: ITableCellProps,
): ReactElement => {
    const { children } = props;
    return (
        <Node>
            <TableCell {...props}>{children}</TableCell>
        </Node>
    );
};

TableCellNode.craft = {
    props: TableCell.defaultProps,
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
                                help: "The identifier of the button.",
                                required: false,
                            },
                            {
                                id: "align",
                                title: "Align",
                                type: "select",
                                size: "small",
                                help: "The text alignment of the table cell. Monetary or generally number fields should be right aligned as that allows you to add them up quickly in your head without having to worry about decimals.",
                                required: false,
                                options: [
                                    { value: "center", title: "Center" },
                                    { value: "justify", title: "Justify" },
                                    { value: "left", title: "Left" },
                                    { value: "right", title: "Right" },
                                    { value: "inherit", title: "Inherit" },
                                ],
                            },
                            {
                                id: "padding",
                                title: "Padding",
                                type: "select",
                                size: "small",
                                help: "The padding of the table cell.",
                                required: false,
                                options: [
                                    { value: "checkbox", title: "Checkbox" },
                                    { value: "none", title: "None" },
                                    { value: "normal", title: "Normal" },
                                    { value: "inherit", title: "Inherit" },
                                ],
                            },
                            {
                                id: "size",
                                title: "Size",
                                type: "select",
                                size: "small",
                                help: "The size of the table cell.",
                                required: false,
                                options: [
                                    { value: "small", title: "Small" },
                                    { value: "medium", title: "Medium" },
                                    { value: "inherit", title: "Inherit" },
                                ],
                            },
                            {
                                id: "variant",
                                title: "Variant",
                                type: "select",
                                size: "small",
                                help: "The variant of the table cell.",
                                required: false,
                                options: [
                                    { value: "body", title: "Body" },
                                    { value: "footer", title: "Footer" },
                                    { value: "head", title: "Head" },
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

export default TableCellNode;
