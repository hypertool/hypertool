import type { FunctionComponent, ReactElement, ReactNode } from "react";
import { useMemo } from "react";

import {
    Icon,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useEditor, useNode } from "../craft";
import { useContextMenu } from "../hooks";

export interface IProps {
    type?: string;
    rootProps?: Record<string, any>;
    children?: ReactNode;
}

interface IRootProps {
    selected: boolean;
    hovered: boolean;
}

const Root = styled("div", {
    shouldForwardProp: (prop: string) =>
        !["hovered", "selected"].includes(prop),
})<IRootProps>(({ theme, hovered, selected }) => ({
    position: "relative",
    border:
        hovered || selected
            ? `2px solid ${theme.palette.primary.light}`
            : undefined,
    width: "fit-content",
    height: "fit-content",
}));

interface IIndicatorProps {
    show: boolean;
}

const Indicator = styled("div", {
    shouldForwardProp: (prop: string) => !["hovered"].includes(prop),
})<IIndicatorProps>(({ theme, show }) => ({
    visibility: show ? "visible" : "hidden",
    borderRadius: "4px 4px 0px 0px",
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(0.5, 1),
    width: "fit-content",
    height: "fit-content",
    fontSize: 10,
    color: "white",
    position: "absolute",
    top: -24,
    left: -2,
    zIndex: 999,
}));

const Node: FunctionComponent<IProps> = (props: IProps): ReactElement => {
    const { children, rootProps } = props;

    const { anchor, onContextMenuOpen, onContextMenuClose } = useContextMenu();

    const {
        connectors: { connect, drag },
        hovered,
        selected,
        id,
    } = useNode((state) => ({
        hovered: state.events.hovered,
        selected: state.events.selected,
    }));
    const { actions, data } = useEditor((state) => ({
        data: state.nodes[id] && state.nodes[id].data,
    }));

    const menuItems = useMemo(
        () => [
            {
                id: "delete",
                text: "Delete",
                icon: "delete",
                callback: () => {
                    onContextMenuClose();
                    actions.delete(id);
                },
            },
        ],
        [actions, onContextMenuClose],
    );

    return (
        <Root
            ref={(ref) => connect(drag(ref))}
            selected={selected}
            hovered={hovered}
            {...rootProps}
            onContextMenu={onContextMenuOpen}
        >
            <Indicator show={hovered}>{data.name}</Indicator>

            {children}

            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={onContextMenuClose}
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
