import type { FunctionComponent, ReactElement } from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";

import type { Resource } from "../../types";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  height: `calc(100vh - 216px)`,
  [theme.breakpoints.up("lg")]: {
    height: `calc(100vh - 192px)`,
  },
}));

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 400 },
  { field: "type", headerName: "Type", width: 200 },
  { field: "createdAt", headerName: "Created At", width: 256 },
  { field: "status", headerName: "Status", width: 200 },
  { field: "createdBy", headerName: "Created By", width: 400 },
];

interface Props {
  selectable: boolean;
  resources: Resource[];
}

const ResourcesTable: FunctionComponent<Props> = (
  props: Props
): ReactElement => {
  const { selectable, resources } = props;
  return (
    <Root>
      <DataGrid
        rows={resources}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection={selectable}
      />
    </Root>
  );
};

ResourcesTable.defaultProps = {
  selectable: false,
};

export default ResourcesTable;
