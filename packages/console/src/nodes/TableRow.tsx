import type { FunctionComponent, ReactElement, ReactNode } from "react";

import { TableRow as MuiTableRow } from "@mui/material";

export interface ITableRowProps {
    id?: string;
    hover?: boolean;
    selected?: boolean;
    children?: ReactNode;
}

const TableRow: FunctionComponent<ITableRowProps> = (
    props: ITableRowProps,
): ReactElement => {
    const { children, hover, selected } = props;
    return (
        <MuiTableRow
            style={{
                display: "flex",
                flexDirection: "row",
                ...(children ? { height: "fit-content" } : { height: 56 }),
                width: "100%",
            }}
            hover={hover}
            selected={selected}
        >
            {children}
        </MuiTableRow>
    );
};

TableRow.defaultProps = {
    id: undefined,
    hover: true,
    selected: false,
};

export default TableRow;
