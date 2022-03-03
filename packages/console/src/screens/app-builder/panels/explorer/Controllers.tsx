import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useContext, useState } from "react";

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

import { BuilderActionsContext } from "../../../../contexts";

import NewControllerDialog from "./NewControllerDialog";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const Controllers: FunctionComponent = (): ReactElement => {
    const { createNewTab } = useContext(BuilderActionsContext);
    const [newDialog, setNewDialog] = useState(false);

    const handleCreateController = useCallback(
        (name: string) => {
            createNewTab(name, false, "controller");
            setNewDialog(false);
        },
        [createNewTab],
    );

    const handleCloseNewDialog = useCallback(() => {
        setNewDialog(false);
    }, [setNewDialog]);

    const handleOpenNewDialog = useCallback(() => {
        setNewDialog(true);
    }, [setNewDialog]);

    const renderController = (title: string) => (
        <ListItem
            key={title}
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
            <ListItemText primary={title} />
        </ListItem>
    );

    return (
        <div>
            <List dense={true}>
                {["home-controller", "users-controller"].map(renderController)}
            </List>
            <Actions>
                <Button
                    size="small"
                    fullWidth={true}
                    variant="outlined"
                    color="primary"
                    endIcon={<Icon>add</Icon>}
                    onClick={handleOpenNewDialog}
                >
                    Create New Controller
                </Button>
            </Actions>
            <NewControllerDialog
                open={newDialog}
                onCreate={handleCreateController}
                onClose={handleCloseNewDialog}
            />
        </div>
    );
};

export default Controllers;
