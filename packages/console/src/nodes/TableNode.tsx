import type { ReactElement } from "react";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type { CraftComponent } from "../types";

import Node from "./Node";
import Table, { ITableProps } from "./Table";

const TableNode: CraftComponent<ITableProps> = (
    props: ITableProps,
): ReactElement => {
    const { children } = props;
    return (
        <Node>
            <Table {...props}>{children}</Table>
        </Node>
    );
};

TableNode.craft = {
    props: Table.defaultProps,
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
                                id: "padding",
                                title: "Padding",
                                type: "select",
                                size: "small",
                                help: "The padding inherited by table cells.",
                                required: false,
                                options: [
                                    { value: "checkbox", title: "Checkbox" },
                                    { value: "none", title: "None" },
                                    { value: "normal", title: "Normal" },
                                ],
                            },
                            {
                                id: "size",
                                title: "Size",
                                type: "select",
                                size: "small",
                                help: "The size inherited by table cells.",
                                required: false,
                                options: [
                                    { value: "medium", title: "Medium" },
                                    { value: "small", title: "Small" },
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

export default TableNode;
