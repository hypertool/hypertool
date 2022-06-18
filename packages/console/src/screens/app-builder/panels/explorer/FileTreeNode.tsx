import {
    ListItemIcon,
    Menu,
    MenuItem,
    Icon,
    ListItemText,
    Collapse,
    Divider,
} from "@mui/material";
import { TreeItem, treeItemClasses } from "@mui/lab";
import type { TreeItemProps } from "@mui/lab";
import { alpha, styled } from "@mui/material/styles";
import { useMemo } from "react";
import type { TransitionProps } from "@mui/material/transitions";
import { IPathNode } from "../../../../types";
import { useContextMenu } from "../../../../hooks";

const TransitionComponent = (props: TransitionProps) => {
    return <Collapse {...props} />;
};

const StyledTreeItem = styled((props: TreeItemProps) => (
    <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
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
}));

export interface IFileTreeNodeProps {
    absolutePath: string;
    name: string;
}

const FileTreeNode = (props: any) => {
    const { node } = props;
    const { anchor, mouseX, mouseY, onContextMenuOpen, onContextMenuClose } =
        useContextMenu();

    const menuItems = useMemo(
        () => [
            {
                id: "new_file",
                text: "New File",
                icon: "add_circle",
                callback: () => {
                    onContextMenuClose();
                },
            },
            {
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
            null,
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
        ],
        [onContextMenuClose],
    );

    return (
        <StyledTreeItem
            nodeId={node.name}
            label={node.name}
            onContextMenu={onContextMenuOpen}
        >
            {node.children.map((child: IPathNode) => (
                <FileTreeNode node={child} />
            ))}

            <Menu
                anchorReference="anchorPosition"
                anchorPosition={{ top: mouseY - 4, left: mouseX - 4 }}
                open={Boolean(anchor)}
                onClose={onContextMenuClose}
            >
                {menuItems.map((menuItem) => (
                    <>
                        {menuItem && (
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
                        {!menuItem && <Divider />}
                    </>
                ))}
            </Menu>
        </StyledTreeItem>
    );
};

export default FileTreeNode;
