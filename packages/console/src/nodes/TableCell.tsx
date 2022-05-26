import type { FunctionComponent, ReactElement, ReactNode } from "react";

import { TableCell as MuiTableCell } from "@mui/material";

export interface ITableCellProps {
    id?: string;
    align?: "center" | "justify" | "left" | "right" | "inherit";
    padding?: "checkbox" | "none" | "normal" | "inherit";
    size?: "small" | "medium" | "inherit";
    variant?: "body" | "footer" | "head";
    children?: ReactNode;
}

const TableCell: FunctionComponent<ITableCellProps> = (
    props: ITableCellProps,
): ReactElement => {
    const { children, align, padding, size, variant } = props;
    return (
        <MuiTableCell
            align={align}
            padding={padding === "inherit" ? undefined : padding}
            size={size === "inherit" ? undefined : size}
            variant={variant}
            style={{ display: "flex", height: "fit-content", width: 200 }}
        >
            {children}
        </MuiTableCell>
    );
};

TableCell.defaultProps = {
    align: "inherit",
    padding: "inherit",
    size: "inherit",
    variant: "body",
};

export default TableCell;
