import type { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useCallback, useState } from "react";

import {
    Icon,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useConfirm } from "material-ui-confirm";

const StyledListItemAvatar = styled(ListItemAvatar)({ minWidth: 28 });

export interface IScreenProps {
    id: string;
    name: string;
    onEdit: (id: string, name: string) => void;
    onDelete: (id: string, name: string) => void;
}

const Screen: FunctionComponent<IScreenProps> = (
    props: IScreenProps,
): ReactElement => {
    const { id, name, onEdit, onDelete } = props;
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const confirm = useConfirm();

    const handleOpenMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchor(event.currentTarget);
    }, []);

    const handleCloseMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchor(null);
    }, []);

    const handleEdit = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            setAnchor(null);
            onEdit(id, name);
        },
        [id, name],
    );

    const handleDelete = useCallback(
        async (event: MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            setAnchor(null);
            try {
                await confirm({
                    title: "Are you sure you want to delete?",
                    description: `This action cannot be undone. This will permanently delete the "${name}" screen.`,
                    confirmationText: "Delete",
                    cancellationText: "Cancel",
                    allowClose: true,
                });
                onDelete(id, name);
            } catch (error: unknown) {}
        },
        [id, name, onDelete],
    );

    return (
        <ListItem
            button={true}
            secondaryAction={
                <IconButton edge="end" onClick={handleOpenMenu}>
                    <Icon fontSize="small">more_vert</Icon>
                </IconButton>
            }
            onClick={handleEdit}
        >
            <StyledListItemAvatar>
                <Icon fontSize="small">wysiwyg</Icon>
            </StyledListItemAvatar>
            <ListItemText primary={name} />
            <Menu
                anchorEl={anchor}
                keepMounted={true}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={Boolean(anchor)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </ListItem>
    );
};

export default Screen;
