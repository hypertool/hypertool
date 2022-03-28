import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useContext } from "react";

import {
    Button,
    Icon,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import { useParams } from "react-router-dom";

import { BuilderActionsContext } from "../../../../contexts";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const StyledListItemAvatar = styled(ListItemAvatar)({ minWidth: 28 });

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

    const handleEditScreen = (screenId: string) => () => {
        createTab("edit-screen", { screenId });
    };

    const renderScreen = (record: any) => (
        <ListItem
            key={record.id}
            button={true}
            /*
             * secondaryAction={
             *     <IconButton edge="end">
             *         <Icon fontSize="small">delete</Icon>
             *     </IconButton>
             * }
             */
            onClick={handleEditScreen(record.id)}
        >
            <StyledListItemAvatar>
                <Icon fontSize="small">wysiwyg</Icon>
            </StyledListItemAvatar>
            <ListItemText primary={record.name} />
        </ListItem>
    );

    return (
        <div>
            <List dense={true}>{records.map(renderScreen)}</List>
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
