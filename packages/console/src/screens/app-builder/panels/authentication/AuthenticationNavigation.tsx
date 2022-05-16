import { ReactNode, useCallback } from "react";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Icon,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useBuilderActions } from "../../../../hooks";

const StyledListItemAvatar = styled(ListItemIcon)({ minWidth: 28 });

const AuthenticationNavigation = () => {
    const { createTab } = useBuilderActions();

    const handleUsersClick = useCallback(
        () => createTab("authentication.view-users"),
        [createTab],
    );

    const handleProvidersClick = useCallback(
        () => createTab("authentication.view-providers"),
        [createTab],
    );

    const renderItem = (
        icon: string,
        text: string,
        handleClick: () => void,
    ) => (
        <ListItem key={text} button={true} onClick={handleClick}>
            <StyledListItemAvatar>
                <Icon fontSize="small">{icon}</Icon>
            </StyledListItemAvatar>
            <ListItemText primary={text} />
        </ListItem>
    );

    return (
        <div>
            <List dense={true}>
                {renderItem("people", "Users", handleUsersClick)}
                {renderItem("password", "Providers", handleProvidersClick)}
            </List>
        </div>
    );
};

export default AuthenticationNavigation;
