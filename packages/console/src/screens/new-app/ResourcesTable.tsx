import type { FunctionComponent, ReactElement } from "react";
import { useCallback } from "react";

import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import type { GridCallbackDetails, GridSelectionModel } from "@mui/x-data-grid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const ProgressContainer = styled("div")(({ theme }) => ({
    width: "100%",
    height: "calc(100vh - 264px)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
}));

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

interface Props {
    selectable: boolean;
    onResourcesSelected: (resources: string[]) => void;
    selectedResources: string[];
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
    props: Props,
): ReactElement => {
    const { selectable, onResourcesSelected, selectedResources } = props;
    // TODO: Destructure `error`, check for non-null, send to sentry
    const { loading, data } = useQuery(GET_RESOURCES, {
        variables: {
            page: 0,
            limit: 20,
        },
    });

    const handleRowClick = useCallback(
        (selectionModel: GridSelectionModel, details: GridCallbackDetails) => {
            onResourcesSelected(selectionModel as string[]);
        },
        [onResourcesSelected],
    );

    if (loading) {
        return (
            <ProgressContainer>
                <CircularProgress size="28px" />
            </ProgressContainer>
        );
    }

    return (
        <Root>
            <DataGrid
                rows={data.getResources.records}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection={selectable}
                onSelectionModelChange={handleRowClick}
                selectionModel={selectedResources}
            />
        </Root>
    );
};

ResourcesTable.defaultProps = {
    selectable: false,
};

export default ResourcesTable;
