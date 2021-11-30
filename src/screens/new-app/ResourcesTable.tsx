import type { FunctionComponent, ReactElement } from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { gql, useQuery } from "@apollo/client";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  height: `calc(100vh - 216px)`,
  [theme.breakpoints.up("lg")]: {
    height: `calc(100vh - 272px)`,
  },
}));

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 256 },
  { field: "type", headerName: "Type", width: 200 },
];

const rows = [
  { id: 1, name: "ecommerce", type: "mysql", createdAt: "11-17-2021" },
  { id: 2, name: "content", type: "mongodb", createdAt: "11-17-2021" },
  { id: 3, name: "ecommerce_data", type: "bigquery", createdAt: "11-17-2021" },
  { id: 4, name: "users", type: "graphql_api", createdAt: "10-17-2021" },
  { id: 5, name: "vindb", type: "rest_api", createdAt: "9-8-2021" },
  { id: 6, name: "ecommerce", type: "mysql", createdAt: "11-17-2021" },
  { id: 7, name: "content", type: "mongodb", createdAt: "11-17-2021" },
  { id: 8, name: "ecommerce_data", type: "bigquery", createdAt: "11-17-2021" },
  { id: 9, name: "users", type: "graphql_api", createdAt: "10-17-2021" },
  { id: 10, name: "vindb", type: "rest_api", createdAt: "9-8-2021" },
];

interface Props {
  selectable: boolean;
}

const GET_RESOURCES = gql`
  query GetResources($page: Int, $limit: Int) {
    getResources(page: $page, limit: $limit) {
      totalPages
      records {
        id
        name
        type
      }
    }
  }
`;

const ResourcesTable: FunctionComponent<Props> = (
  props: Props
): ReactElement => {
  const { selectable } = props;
  const { loading, error, data } = useQuery(GET_RESOURCES, {
    variables: {
      page: 0,
      limit: 20,
    },
  });

  return (
    <Root>
      <DataGrid
        rows={rows}
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
