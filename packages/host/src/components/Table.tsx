import type { FunctionComponent, ReactElement, ReactNode } from "react";

import { Table as MuiTable } from "@mui/material";

export interface ITableProps {
  id?: string;
  padding?: "checkbox" | "none" | "normal";
  size?: "medium" | "small";
  height?: string;
  width?: string;
  children?: ReactNode;
}

const Table: FunctionComponent<ITableProps> = (
  props: ITableProps
): ReactElement => {
  const { id, padding, size, height, width, children } = props;
  return (
    <MuiTable
      id={`hypertool-${id}`}
      padding={padding}
      size={size}
      style={{
        height,
        width,
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
  height: "800px",
  width: "800px",
};

export default Table;
