import type {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
} from "react";
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
    hovered: boolean;
}

const Indicator = styled("div", {
    shouldForwardProp: (prop: string) => !["hovered"].includes(prop),
})<IIndicatorProps>(({ theme, hovered }) => ({
    visibility: hovered ? "visible" : "hidden",
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
    const { actions, data } = useEditor((state) => ({
        data: state.nodes[id] && state.nodes[id].data,
    }));

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
            <Indicator hovered={hovered}>{data.name}</Indicator>

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
