import type { FunctionComponent, ReactElement } from "react";

import {
    Avatar,
    Icon,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";

const Queries: FunctionComponent = (): ReactElement => {
    const renderQuery = (title: string) => (
        <ListItem
            key={title}
            secondaryAction={
                <IconButton edge="end" aria-label="delete">
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
        </div>
    );
};

export default Queries;
