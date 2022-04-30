import type { FunctionComponent, ReactElement } from "react";
import { useCallback } from "react";

import { Divider, Icon, ListItemIcon, Menu, MenuItem } from "@mui/material";

export interface IAppOptionsMenuProps {
    id: string;
    name: string;
    open: boolean;
    onClose: () => void;
    anchor: HTMLElement | null;
    onToggleStar: (id: string) => void;
    onDuplicate: (id: string, name: string) => void;
    onTogglePublish: (id: string) => void;
    onRename: (id: string) => void;
    onDelete: (id: string) => void;
    onLaunch: (id: string, name: string) => void;
}

interface Group {
    title: string;
    items: Item[];
}

interface Item {
    title: string;
    icon: string;
    action: (id: string) => void;
}

const AppOptionsMenu: FunctionComponent<IAppOptionsMenuProps> = (
    props: IAppOptionsMenuProps,
): ReactElement => {
    const {
        id,
        name,
        open,
        onClose,
        anchor,
        onToggleStar,
        onDuplicate,
        onTogglePublish,
        onRename,
        onLaunch,
        onDelete,
    } = props;

    const handleToggleStar = useCallback(() => {
        onToggleStar(id);
        onClose();
    }, [id, onClose, onToggleStar]);

    const handleDuplicate = useCallback(() => {
        onDuplicate(id, name);
        onClose();
    }, [id, name, onClose, onDuplicate]);

    const handleTogglePublish = useCallback(() => {
        onTogglePublish(id);
        onClose();
    }, [id, onClose, onTogglePublish]);

    const handleRename = useCallback(() => {
        onRename(id);
        onClose();
    }, [id, onClose, onRename]);

    const handleLaunch = useCallback(() => {
        onLaunch(id, name);
        onClose();
    }, [id, onClose, onLaunch]);

    const handleDelete = useCallback(() => {
        onDelete(id);
        onClose();
    }, [id, onClose, onDelete]);

    const groups: Group[] = [
        {
            title: "Administrator",
            items: [
                {
                    title: "Duplicate",
                    icon: "content_copy",
                    action: handleDuplicate,
                },
                /*
                 * {
                 *     title: "Publish",
                 *     icon: "publish",
                 *     action: handleTogglePublish,
                 * },
                 */
                {
                    title: "Launch",
                    icon: "launch",
                    action: handleLaunch,
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

    const renderItem = (item: Item) => (
        <MenuItem key={item.title} onClick={item.action as any}>
            <ListItemIcon>
                <Icon fontSize="small">{item.icon}</Icon>
            </ListItemIcon>
            {item.title}
        </MenuItem>
    );

    const renderGroup = (group: Group, index: number) => (
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
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
            {groups.map(renderGroup)}
        </Menu>
    );
};

export default AppOptionsMenu;
