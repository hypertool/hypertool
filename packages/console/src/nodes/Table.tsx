import type { FunctionComponent, ReactElement, ReactNode } from "react";

import { Table as MuiTable } from "@mui/material";

export interface ITableProps {
    id?: string;
    padding?: "checkbox" | "none" | "normal";
    size?: "medium" | "small";
    children?: ReactNode;
}

const Table: FunctionComponent<ITableProps> = (
    props: ITableProps,
): ReactElement => {
    const { id, padding, size, children } = props;
    return (
        <MuiTable
            padding={padding}
            size={size}
            style={{
                minWidth: 800,
                minHeight: 800,
                backgroundColor: "white",
            }}
        >
            {children}
        </MuiTable>
    );
};

Table.defaultProps = {
    padding: "normal",
    size: "medium",
};

export default Table;
