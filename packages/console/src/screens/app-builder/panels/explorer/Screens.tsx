import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useContext } from "react";

import { Button, Icon, List } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useMutation, useQuery } from "@apollo/client";

import { BuilderActionsContext } from "../../../../contexts";
import { useNotification, useParam } from "../../../../hooks";
import { IEditScreenBundle, ITab } from "../../../../types";

import Screen from "./Screen";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const GET_SCREENS = gql`
    query GetScreens($app: ID!, $page: Int, $limit: Int) {
        getScreens(app: $app, page: $page, limit: $limit) {
            totalPages
            records {
                id
                name
            }
        }
    }
`;

const DELETE_SCREEN = gql`
    mutation DeleteScreen($screenId: ID!) {
        deleteScreen(screenId: $screenId) {
            success
        }
    }
`;

const Screens: FunctionComponent = (): ReactElement => {
    const { createTab, closeTabs } = useContext(BuilderActionsContext);
    const appId = useParam("appId");
    const notification = useNotification();

    const { data } = useQuery(GET_SCREENS, {
        variables: {
            page: 0,
            limit: 20,
            app: appId,
        },
    });
    const { records } = data?.getScreens || { records: [] };

    const [deleteScreen] = useMutation(DELETE_SCREEN, {
        refetchQueries: ["GetScreens"],
    });

    const handleNewScreen = useCallback(() => {
        createTab("new-screen");
    }, [createTab]);

    const handleEditScreen = useCallback((screenId: string) => {
        createTab("edit-screen", { screenId });
    }, []);

    const handleDeleteScreen = useCallback(
        async (screenId: string, name: string) => {
            closeTabs(
                (tab: ITab<IEditScreenBundle>) =>
                    tab.bundle?.screenId === screenId,
            );

            try {
                notification.notify({
                    type: "warning",
                    message: `Deleting screen "${name}"...`,
                    closeable: false,
                    autoCloseDuration: -1,
                });

                await deleteScreen({ variables: { screenId } });

                notification.notifySuccess(
                    `Screen "${name}" deleted successfully`,
                );
            } catch (error: any) {
                notification.notifyError(error);
            }
        },
        [],
    );

    return (
        <div>
            <List dense={true}>
                {records.map((screen: any) => (
                    <Screen
                        key={screen.id}
                        id={screen.id}
                        name={screen.name}
                        onEdit={handleEditScreen}
                        onDelete={handleDeleteScreen}
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
                    onClick={handleNewScreen}
                >
                    Create New Screen
                </Button>
            </Actions>
        </div>
    );
};

export default Screens;
