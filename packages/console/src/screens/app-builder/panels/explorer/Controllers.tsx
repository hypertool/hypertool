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

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const Controllers: FunctionComponent = (): ReactElement => {
    const { createNewTab } = useContext(BuilderActionsContext);

    const handleCreateController = useCallback(() => {
        createNewTab("new-controller");
    }, [createNewTab]);

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
                    onClick={handleCreateController}
                >
                    Create New Controller
                </Button>
            </Actions>
        </div>
    );
};

export default Controllers;
