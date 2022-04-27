import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useContext } from "react";

import { Button, Icon, List } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useMutation, useQuery } from "@apollo/client";

import { BuilderActionsContext } from "../../../../contexts";
import { useNotification, useParam } from "../../../../hooks";
import { IEditResourceBundle, ITab } from "../../../../types";

import Resource from "./Resource";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
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

const DELETE_RESOURCE = gql`
    mutation DeleteResource($resourceId: ID!) {
        deleteResource(resourceId: $resourceId) {
            success
        }
    }
`;

const Resources: FunctionComponent = (): ReactElement => {
    const { createTab, closeTabs } = useContext(BuilderActionsContext);
    const notification = useNotification();

    const [deleteResource] = useMutation(DELETE_RESOURCE, {
        refetchQueries: ["GetResources"],
    });

    const appId = useParam("appId");
    const { data } = useQuery(GET_RESOURCES, {
        variables: {
            page: 0,
            limit: 20,
            app: appId,
        },
    });
    const { records } = data?.getResources || { records: [] };

    const handleNewResource = useCallback(() => {
        createTab("new-resource");
    }, [createTab]);

    const handleEditResource = useCallback((resourceId: string) => {
        createTab("edit-resource", { resourceId });
    }, []);

    const handleDeleteResource = useCallback(
        async (resourceId: string, name: string) => {
            closeTabs(
                (tab: ITab<IEditResourceBundle>) =>
                    tab.bundle?.resourceId === resourceId,
            );

            try {
                notification.notify({
                    type: "warning",
                    message: `Deleting resource "${name}"...`,
                    closeable: false,
                    autoCloseDuration: -1,
                });

                await deleteResource({ variables: { resourceId } });

                notification.notify({
                    type: "success",
                    message: `Resource "${name}" deleted successfully`,
                    closeable: true,
                    autoCloseDuration: 2000,
                });
            } catch (error: any) {
                notification.notify({
                    type: "error",
                    message:
                        error.graphQLErrors[0].message ||
                        `Failed to delete resource "${name}"`,
                    closeable: true,
                    autoCloseDuration: 2000,
                });
            }
        },
        [],
    );

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
