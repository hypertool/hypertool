import type { FunctionComponent, ReactElement, ReactNode } from "react";

import { TableRow as MuiTableRow, styled } from "@mui/material";

const EmptyRowContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderStyle: "dotted",
    padding: theme.spacing(2),
}));

const EmptyRowText = styled("p")(({ theme }) => ({
    fontStyle: "italic",
    fontSize: 12,
    textAlign: "center",
    width: "100%",
    padding: 0,
    margin: 0,
}));

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
                ...(children
                    ? { height: "fit-content", width: "fit-content" }
                    : { height: 56, width: "100%" }),
            }}
            hover={hover}
            selected={selected}
        >
            {children || (
                <EmptyRowContainer>
                    <EmptyRowText>
                        Add one or more table cells for this table row
                    </EmptyRowText>
                </EmptyRowContainer>
            )}
        </MuiTableRow>
    );
};

TableRow.defaultProps = {
    id: undefined,
    hover: true,
    selected: false,
};

export default TableRow;
