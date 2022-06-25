import {
    ListItemIcon,
    Menu,
    MenuItem,
    Icon,
    ListItemText,
    Collapse,
    Divider,
} from "@mui/material";
import type { MouseEvent } from "react";

import { TreeItem, treeItemClasses } from "@mui/lab";
import type { TreeItemProps } from "@mui/lab";
import { alpha, styled } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import type { TransitionProps } from "@mui/material/transitions";
import { INewFileOptions, IPath, IPathNode } from "../../../../types";
import { useBuilderActions, useContextMenu } from "../../../../hooks";
import { truthy } from "../../../../utils";

import NewScreenDialog from "./NewScreenDialog";

const TransitionComponent = (props: TransitionProps) => {
    return <Collapse {...props} />;
};

interface IStyledTreeItemProps extends TreeItemProps {
    contextMenuOpen: boolean;
}

const StyledTreeItem = styled((props: IStyledTreeItemProps) => (
    <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme, contextMenuOpen }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
        "& .close": {
            opacity: 0.3,
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
    [`& > .${treeItemClasses.content}`]: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: contextMenuOpen
            ? theme.palette.primary.light
            : "transparent",
    },
}));

export interface IFileTreeNodeProps {
    node: IPathNode;
    onNew: (options: INewFileOptions) => void;
    onEdit: (node: IPath) => void;
}

interface IMenuItem {
    id: string;
    text: string;
    icon: string;
    callback: () => void;
}

const FileTreeNode = (props: IFileTreeNodeProps) => {
    const { node, onNew, onEdit } = props;
    const { anchor, mouseX, mouseY, onContextMenuOpen, onContextMenuClose } =
        useContextMenu();
    const actions = useBuilderActions();
    const [open, setOpen] = useState(false);

    const { directory, name } = node.path;
    const appName = actions.getApp().name;

    const handleCreate = useCallback(
        (values: any) => {
            onNew({ ...values, type: "screen", parent: node });
            // TODO: Should we show errors in the dialog itself?
            setOpen(false);
        },
        [node, onNew],
    );

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const menuItems: [IMenuItem | string] = useMemo(
        (): any =>
            [
                name === `/${appName}/screens` && {
                    id: "new_screen",
                    text: "New Screen",
                    icon: "wysiwyg",
                    callback: () => {
                        setOpen(true);
                        onContextMenuClose();
                    },
                },
                directory && {
                    id: "new_file",
                    text: "New File",
                    icon: "add_circle",
                    callback: () => {
                        onContextMenuClose();
                    },
                },
                directory && {
                    id: "new_folder",
                    text: "New Folder",
                    icon: "create_new_folder",
                    callback: () => {
                        onContextMenuClose();
                    },
                },
                {
                    id: "copy_path",
                    text: "Copy Path",
                    icon: "file_copy",
                    callback: () => {
                        onContextMenuClose();
                    },
                },
                "<divider>",
                {
                    id: "rename",
                    text: "Rename",
                    icon: "drive_file_rename_outline",
                    callback: () => {
                        onContextMenuClose();
                    },
                },
                {
                    id: "delete",
                    text: "Delete",
                    icon: "delete",
                    callback: () => {
                        onContextMenuClose();
                    },
                },
            ].filter(truthy),
        [appName, directory, name, onContextMenuClose],
    );

    const handleEdit = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            if (directory) {
                return;
            }

            onEdit(node.path);
        },
        [directory, node, onEdit],
    );

    return (
        <>
            <NewScreenDialog
                open={open}
                onCreate={handleCreate}
                onClose={handleClose}
            />
            <StyledTreeItem
                nodeId={node.name}
                label={node.name}
                onContextMenu={onContextMenuOpen}
                contextMenuOpen={Boolean(anchor)}
                onClick={handleEdit}
            >
                {node.children.map((child: IPathNode) => (
                    <FileTreeNode node={child} onNew={onNew} onEdit={onEdit} />
                ))}
            </StyledTreeItem>

            <Menu
                anchorReference="anchorPosition"
                anchorPosition={{ top: mouseY - 4, left: mouseX - 4 }}
                open={Boolean(anchor)}
                onClose={onContextMenuClose}
            >
                {menuItems.map((menuItem) => (
                    <>
                        {typeof menuItem !== "string" && (
                            <MenuItem
                                id={menuItem.id}
                                onClick={menuItem.callback}
                            >
                                <ListItemIcon>
                                    <Icon fontSize="small">
                                        {menuItem.icon}
                                    </Icon>
                                </ListItemIcon>
                                <ListItemText>{menuItem.text}</ListItemText>
                            </MenuItem>
                        )}
                        {menuItem === "<divider>" && <Divider />}
                    </>
                ))}
            </Menu>
        </>
    );
};

export default FileTreeNode;
