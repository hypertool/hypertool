import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 400 },
  { field: "type", headerName: "Type", width: 200 },
  { field: "createdAt", headerName: "Created At", width: 200 },
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

export default function DataTable() {
  return (
    <div style={{ height: `calc(100vh - 300px)`, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection={true}
      />
    </div>
  );
}
