import type { ReactElement } from "react";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type { CraftComponent } from "../types";

import Node from "./Node";
import TableRow, { ITableRowProps } from "./TableRow";

const TableRowNode: CraftComponent<ITableRowProps> = (
    props: ITableRowProps,
): ReactElement => {
    const { children } = props;
    return (
        <Node>
            <TableRow {...props}>{children}</TableRow>
        </Node>
    );
};

TableRowNode.craft = {
    props: TableRow.defaultProps,
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
                                id: "hover",
                                title: "Hover",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the table row will shade on hover.",
                                required: false,
                            },
                            {
                                id: "selected",
                                title: "Selected",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the table row is selected.",
                                required: false,
                            },
                        ],
                    },
                ]}
                validationSchema={undefined}
            />
        ),
    },
};

export default TableRowNode;
