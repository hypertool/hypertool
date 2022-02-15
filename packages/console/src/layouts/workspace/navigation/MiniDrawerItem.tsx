import type { FunctionComponent, ReactElement } from "react";

import { useCallback } from "react";
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    Icon,
    Tooltip,
} from "@mui/material";

import { Wrap } from "../../../components";

interface Props {
    open: boolean;
    title: string;
    url: string;
    icon: string;
    onClick: (url: string) => void;
}

const MiniDrawerItem: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { open, title, url, icon, onClick } = props;
    const handleClick = useCallback(() => {
        onClick(url);
    }, [onClick, url]);

    return (
        <Wrap when={!open} wrapper={Tooltip} title={title}>
            <ListItem key={title} button={true} onClick={handleClick}>
                <ListItemIcon>
                    <Icon>{icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={title} />
            </ListItem>
        </Wrap>
    );
};

export default MiniDrawerItem;
