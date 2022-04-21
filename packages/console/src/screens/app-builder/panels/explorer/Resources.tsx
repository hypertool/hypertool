import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useContext } from "react";

import { Button, Icon, List } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import { BuilderActionsContext } from "../../../../contexts";

import Resource from "./Resource";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const GET_RESOURCES = gql`
    query GetResources($page: Int, $limit: Int) {
        getResources(page: $page, limit: $limit) {
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

const Resources: FunctionComponent = (): ReactElement => {
    const { createTab } = useContext(BuilderActionsContext);
    const { data } = useQuery(GET_RESOURCES, {
        variables: {
            page: 0,
            limit: 20,
        },
    });
    const { records } = data?.getResources || { records: [] };

    const handleNewResource = useCallback(() => {
        createTab("new-resource");
    }, [createTab]);

    const handleEditResource = useCallback((resourceId: string) => {
        createTab("edit-resource", { resourceId });
    }, []);

    const handleDeleteResource = useCallback((resourceId: string) => {
        console.log("delete");
    }, []);

    return (
        <div>
            <List dense={true}>
                {records.map((resource: any) => (
                    <Resource
                        key={resource.id}
                        id={resource.id}
                        name={resource.name}
                        onEdit={handleEditResource}
                        onDelete={handleDeleteResource}
                    />
                ))}
            </List>
            <Actions>
                <Button
                    size="small"
                    fullWidth={true}
                    variant="outlined"
                    color="primary"
                    endIcon={<Icon>add</Icon>}
                    onClick={handleNewResource}
                >
                    Create New Resource
                </Button>
            </Actions>
        </div>
    );
};

export default Resources;
