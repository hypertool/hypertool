import type { FunctionComponent, ReactElement } from "react";

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

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const Queries: FunctionComponent = (): ReactElement => {
    const renderQuery = (title: string) => (
        <ListItem
            key={title}
            secondaryAction={
                <IconButton edge="end">
                    <Icon fontSize="small">delete</Icon>
                </IconButton>
            }>
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
            <List dense={true}>{["magento", "trell"].map(renderQuery)}</List>
            <Actions>
                <Button
                    size="small"
                    fullWidth={true}
                    variant="outlined"
                    color="primary"
                    endIcon={<Icon>add</Icon>}>
                    Create New Query
                </Button>
            </Actions>
        </div>
    );
};

export default Queries;
