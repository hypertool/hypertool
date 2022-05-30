import type { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";

import {
    Icon,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useEditor, useNode } from "../craft";

export interface IProps {
    backgroundColor?: string;
    width?: string;
    height?: string;
    children: ReactElement;
    rootProps?: Record<string, any>;
}

interface IRootProps {
    selected: boolean;
    hovered: boolean;
}

const Root = styled("div", {
    shouldForwardProp: (prop: string) =>
        !["hovered", "selected"].includes(prop),
})<IRootProps>(({ theme, hovered, selected }) => ({
    border:
        hovered || selected
            ? `2px solid ${theme.palette.primary.light}`
            : undefined,
    width: "fit-content",
    height: "fit-content",
}));

const Node: FunctionComponent<IProps> = (props: IProps): ReactElement => {
    const { children, rootProps } = props;

    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const {
        connectors: { connect, drag },
        hovered,
        selected,
        id,
    } = useNode((state) => ({
        hovered: state.events.hovered,
        selected: state.events.selected,
    }));
    const { actions } = useEditor();

    const handleContextMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchor(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchor(null);
    }, []);

    const menuItems = useMemo(
        () => [
            {
                id: "delete",
                text: "Delete",
                icon: "delete",
                callback: () => {
                    handleClose();
                    actions.delete(id);
                },
            },
        ],
        [actions, handleClose],
    );

    return (
        <Root
            ref={(ref) => connect(drag(ref))}
            selected={selected}
            hovered={hovered}
            {...rootProps}
            onContextMenu={handleContextMenu}
        >
            {children}

            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={handleClose}
            >
                {menuItems.map((menuItem) => (
                    <MenuItem id={menuItem.id} onClick={menuItem.callback}>
                        <ListItemIcon>
                            <Icon fontSize="small">{menuItem.icon}</Icon>
                        </ListItemIcon>
                        <ListItemText>{menuItem.text}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </Root>
    );
};

export default Node;
