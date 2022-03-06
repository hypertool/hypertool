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

import { BuilderActionsContext } from "../../../../contexts";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const Resources: FunctionComponent = (): ReactElement => {
    const { createNewTab } = useContext(BuilderActionsContext);

    const handleNewResource = useCallback(() => {
        createNewTab("new-resource");
    }, [createNewTab]);

    const handleEditResource = useCallback(() => {
        createNewTab("Edit Resource", { resourceId: "<invalid>" });
    }, [createNewTab]);

    const renderResource = (title: string) => (
        <ListItem
            key={title}
            secondaryAction={
                <IconButton edge="end">
                    <Icon fontSize="small">delete</Icon>
                </IconButton>
            }
            onClick={handleEditResource}
        >
            <ListItemAvatar>
                <Avatar sx={{ width: 28, height: 28 }}>
                    <Icon fontSize="small">category</Icon>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={title} />
        </ListItem>
    );

    return (
        <div>
            <List dense={true}>{["magento", "trell"].map(renderResource)}</List>
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
