import type { FunctionComponent, ReactElement, ReactNode } from "react";

import { TableCell as MuiTableCell, styled } from "@mui/material";

export interface ITableCellProps {
    id?: string;
    align?: "center" | "justify" | "left" | "right" | "inherit";
    padding?: "checkbox" | "none" | "normal" | "inherit";
    size?: "small" | "medium" | "inherit";
    variant?: "body" | "footer" | "head";
    height?: string;
    width?: string;
    children?: ReactNode;
}

const EmptyCellContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
}));

const EmptyCellText = styled("p")(({ theme }) => ({
    color: "black",
    fontStyle: "italic",
    fontSize: 12,
    textAlign: "center",
    width: "100%",
    padding: 0,
    margin: 0,
}));

const TableCell: FunctionComponent<ITableCellProps> = (
    props: ITableCellProps,
): ReactElement => {
    const { children, align, padding, size, variant, height, width } = props;
    return (
        <MuiTableCell
            align={align}
            padding={padding === "inherit" ? undefined : padding}
            size={size === "inherit" ? undefined : size}
            variant={variant}
            style={{
                display: "flex",
                height,
                width,
            }}
        >
            {children || (
                <EmptyCellContainer>
                    <EmptyCellText>Empty table cell</EmptyCellText>
                </EmptyCellContainer>
            )}
        </MuiTableCell>
    );
};

TableCell.defaultProps = {
    align: "inherit",
    padding: "inherit",
    size: "inherit",
    variant: "body",
    height: "56px",
    width: "200px",
};

export default TableCell;
