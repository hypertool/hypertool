import type { FunctionComponent, ReactElement } from "react";
import { useCallback } from "react";

import { Divider, Icon, ListItemIcon, Menu, MenuItem } from "@mui/material";

interface IProps {
    id: string;
    open: boolean;
    onClose: () => void;
    anchor: HTMLElement | null;
    onToggleStar: (id: string) => void;
    onDuplicate: (id: string) => void;
    onTogglePublish: (id: string) => void;
    onRename: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

interface IGroup {
    title: string;
    // eslint-disable-next-line no-use-before-define
    items: IItem[];
}

interface IItem {
    title: string;
    icon: string;
    action: (id: string) => void;
}

const AppOptionsMenu: FunctionComponent<IProps> = (
    props: IProps,
): ReactElement => {
    const {
        id,
        open,
        onClose,
        anchor,
        onToggleStar,
        onDuplicate,
        onTogglePublish,
        onRename,
        onEdit,
        onDelete,
    } = props;

    const handleToggleStar = useCallback(() => {
        onToggleStar(id);
        onClose();
    }, [id, onClose, onToggleStar]);

    const handleDuplicate = useCallback(() => {
        onDuplicate(id);
        onClose();
    }, [id, onClose, onDuplicate]);

    const handleTogglePublish = useCallback(() => {
        onTogglePublish(id);
        onClose();
    }, [id, onClose, onTogglePublish]);

    const handleRename = useCallback(() => {
        onRename(id);
        onClose();
    }, [id, onClose, onRename]);

    const handleEdit = useCallback(() => {
        onEdit(id);
        onClose();
    }, [id, onClose, onEdit]);

    const handleDelete = useCallback(() => {
        onDelete(id);
        onClose();
    }, [id, onClose, onDelete]);

    const groups: IGroup[] = [
        {
            title: "General",
            items: [
                {
                    title: "Star",
                    icon: "star_outline",
                    action: handleToggleStar,
                },
            ],
        },
        {
            title: "Administrator",
            items: [
                {
                    title: "Duplicate",
                    icon: "content_copy",
                    action: handleDuplicate,
                },
                {
                    title: "Publish",
                    icon: "publish",
                    action: handleTogglePublish,
                },
                {
                    title: "Rename",
                    icon: "drive_file_rename_outline",
                    action: handleRename,
                },
                {
                    title: "Edit",
                    icon: "edit",
                    action: handleEdit,
                },
            ],
        },
        {
            title: "Danger",
            items: [
                {
                    title: "Delete",
                    icon: "delete",
                    action: handleDelete,
                },
            ],
        },
    ];

    const renderItem = (item: IItem) => (
        <MenuItem key={item.title} onClick={item.action as any}>
            <ListItemIcon>
                <Icon fontSize="small">{item.icon}</Icon>
            </ListItemIcon>
            {item.title}
        </MenuItem>
    );

    const renderGroup = (group: IGroup, index: number) => (
        <>
            {group.items.map(renderItem)}
            {index + 1 < groups.length && <Divider />}
        </>
    );

    return (
        <Menu
            anchorEl={anchor}
            open={open}
            onClose={onClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
            {groups.map(renderGroup)}
        </Menu>
    );
};

export default AppOptionsMenu;
