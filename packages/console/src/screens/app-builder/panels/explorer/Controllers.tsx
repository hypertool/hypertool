import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useContext } from "react";

import {
    Avatar,
    Button,
    Icon,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import { BuilderActionsContext } from "../../../../contexts";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const GET_CONTROLLERS = gql`
    query GetControllers($page: Int, $limit: Int) {
        getControllers(page: $page, limit: $limit) {
            totalPages
            records {
                id
                name
                language
            }
        }
    }
`;

const Controllers: FunctionComponent = (): ReactElement => {
    const { createTab } = useContext(BuilderActionsContext);
    const { data } = useQuery(GET_CONTROLLERS, {
        variables: {
            page: 0,
            limit: 20,
        },
    });
    const { records } = data?.getControllers || { records: [] };

    const handleCreateController = useCallback(() => {
        createTab("new-controller");
    }, [createTab]);

    const renderController = (record: any) => (
        <ListItem
            key={record.id}
            secondaryAction={
                <IconButton edge="end">
                    <Icon fontSize="small">delete</Icon>
                </IconButton>
            }
        >
            <ListItemAvatar>
                <Avatar sx={{ width: 28, height: 28 }}>
                    <Icon fontSize="small">code</Icon>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={record.name} />
        </ListItem>
    );

    return (
        <div>
            <List dense={true}>{records.map(renderController)}</List>
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
    );
};

export default Controllers;
