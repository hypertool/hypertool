import type { FunctionComponent, ReactElement } from "react";

import { useCallback } from "react";
import { ListItem, ListItemIcon, Icon, Tooltip } from "@mui/material";

import Wrap from "../../../components/Wrap";

interface Props {
    open: boolean;
    title: string;
    id: string;
    url?: string;
    icon: string;
    selected: boolean;
    onClick: (id: string, url?: string) => void;
}

const MiniDrawerItem: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { open, title, id, url, icon, onClick, selected } = props;
    const handleClick = useCallback(() => {
        onClick(id, url);
    }, [onClick, id, url]);

    return (
        <Wrap when={!open} wrapper={Tooltip} title={title}>
            <ListItem
                key={title}
                button={true}
                onClick={handleClick}
                selected={selected}
            >
                <ListItemIcon>
                    <Icon fontSize="medium">{icon}</Icon>
                </ListItemIcon>
            </ListItem>
        </Wrap>
    );
};

export default MiniDrawerItem;
