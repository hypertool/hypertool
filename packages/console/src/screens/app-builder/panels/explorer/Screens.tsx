import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useContext } from "react";

import { Button, Icon, List } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import { useParams } from "react-router-dom";

import { BuilderActionsContext } from "../../../../contexts";

import Screen from "./Screen";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const GET_SCREENS = gql`
    query GetScreens($appId: ID!, $page: Int, $limit: Int) {
        getScreens(appId: $appId, page: $page, limit: $limit) {
            totalPages
            records {
                id
                name
            }
        }
    }
`;

const Screens: FunctionComponent = (): ReactElement => {
    const { createTab } = useContext(BuilderActionsContext);
    const { appId } = useParams();
    const { data } = useQuery(GET_SCREENS, {
        variables: {
            page: 0,
            limit: 20,
            appId,
        },
    });
    const { records } = data?.getScreens || { records: [] };

    const handleNewScreen = useCallback(() => {
        createTab("new-screen");
    }, [createTab]);

    const handleEditScreen = useCallback((screenId: string) => {
        createTab("edit-screen", { screenId });
    }, []);

    const handleDeleteScreen = useCallback((screenId: string) => {
        console.log("Delete");
    }, []);

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
