import type { FunctionComponent, ReactElement } from "react";
import { useCallback } from "react";

import {
    AppBar,
    Button,
    Icon,
    InputAdornment,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import { useNavigate } from "react-router";

import { useParam } from "../../hooks";

import ResourcesTable from "./ResourcesTable";

const Root = styled("section")(() => ({
    width: "100%",
}));

const Title = styled(Typography)(() => ({}));

const WorkspaceToolbar = styled(Toolbar)(() => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
}));

const ActionContainer = styled("div")(() => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
}));

const Search = styled(TextField)(({ theme }) => ({
    width: 264,
    marginRight: theme.spacing(2),
})) as any;

const ActionIcon = styled(Icon)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const TableContainer = styled("div")(({ theme }) => ({
    padding: theme.spacing(4),
}));

const GET_RESOURCES = gql`
    query GetResources($app: ID!, $page: Int, $limit: Int) {
        getResources(app: $app, page: $page, limit: $limit) {
            totalPages
            records {
                id
                name
                type
                status
                createdAt
            }
        }
    }
`;

const ResourceLibrary: FunctionComponent = (): ReactElement => {
    const navigate = useNavigate();
    const appId = useParam("appId");
    // TODO: Destructure `error`, check for non-null, send to sentry
    const { data } = useQuery(GET_RESOURCES, {
        variables: {
            page: 0,
            limit: 20,
            app: appId,
        },
    });

    const handleCreateNew = useCallback(() => {
        navigate("/resources/new");
    }, [navigate]);

    const {
        records = [],
        // totalPages = 0
    } = data?.getResources || {};

    const handleRowClick = useCallback(
        (resource: any) => {
            navigate(`/resources/${resource.id}/edit`);
        },
        [navigate],
    );

    return (
        <Root>
            <AppBar position="static" elevation={1}>
                <WorkspaceToolbar>
                    <Title>Resource Library</Title>
                    <ActionContainer>
                        <Search
                            label=""
                            placeholder="Search"
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Icon fontSize="small">search</Icon>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button size="small" onClick={handleCreateNew}>
                            <ActionIcon fontSize="small">add_circle</ActionIcon>
                            Create New
                        </Button>
                    </ActionContainer>
                </WorkspaceToolbar>
            </AppBar>
            <TableContainer>
                <ResourcesTable
                    selectable={false}
                    resources={records}
                    onRowClick={handleRowClick}
                />
            </TableContainer>
        </Root>
    );
};

export default ResourceLibrary;
