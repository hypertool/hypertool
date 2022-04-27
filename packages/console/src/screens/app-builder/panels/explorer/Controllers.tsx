import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useContext, useState } from "react";

import { Button, Icon, List } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useMutation, useQuery } from "@apollo/client";

import { BuilderActionsContext } from "../../../../contexts";
import { useNotification, useParam } from "../../../../hooks";
import { IEditControllerBundle, ITab } from "../../../../types";

import Controller from "./Controller";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const GET_CONTROLLERS = gql`
    query GetControllers($app: ID!, $page: Int, $limit: Int) {
        getControllers(app: $app, page: $page, limit: $limit) {
            totalPages
            records {
                id
                name
                language
            }
        }
    }
`;

const DELETE_CONTROLLER = gql`
    mutation DeleteController($controllerId: ID!) {
        deleteController(controllerId: $controllerId) {
            success
        }
    }
`;

const Controllers: FunctionComponent = (): ReactElement => {
    const { createTab, closeTabs } = useContext(BuilderActionsContext);
    const appId = useParam("appId");

    const { data } = useQuery(GET_CONTROLLERS, {
        variables: {
            app: appId,
            page: 0,
            limit: 20,
        },
    });
    const { records } = data?.getControllers || { records: [] };
    const notification = useNotification();

    const [deleteController] = useMutation(DELETE_CONTROLLER, {
        refetchQueries: ["GetControllers"],
    });

    const handleCreateController = useCallback(() => {
        createTab("new-controller");
    }, [createTab]);

    const handleEditController = useCallback((controllerId: string) => {
        createTab("edit-controller", { controllerId });
    }, []);

    const handleDeleteController = useCallback(
        async (controllerId: string, name: string) => {
            closeTabs(
                (tab: ITab<IEditControllerBundle>) =>
                    tab.bundle?.controllerId === controllerId,
            );

            try {
                notification.notify({
                    type: "warning",
                    message: `Deleting controller "${name}"...`,
                    closeable: false,
                    autoCloseDuration: -1,
                });

                await deleteController({
                    variables: {
                        controllerId,
                    },
                });

                notification.notify({
                    type: "success",
                    message: `Controller "${name}" deleted successfully`,
                    closeable: true,
                    autoCloseDuration: 2000,
                });
            } catch (error: any) {
                notification.notify({
                    type: "error",
                    message:
                        error.graphQLErrors[0].message ||
                        `Failed to delete controller "${name}"`,
                    closeable: true,
                    autoCloseDuration: 2000,
                });
            }
        },
        [],
    );

    return (
        <>
            <div>
                <List dense={true}>
                    {records.map((controller: any) => (
                        <Controller
                            key={controller.id}
                            id={controller.id}
                            name={controller.name}
                            onEdit={handleEditController}
                            onDelete={handleDeleteController}
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
                        onClick={handleCreateController}
                    >
                        Create New Controller
                    </Button>
                </Actions>
            </div>
        </>
    );
};

export default Controllers;
