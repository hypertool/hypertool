import type { FunctionComponent, ReactElement } from "react";

import { styled } from "@mui/material/styles";

import { useNode } from "../craft";

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
    const {
        connectors: { connect, drag },
        hovered,
        selected,
    } = useNode((state) => ({
        hovered: state.events.hovered,
        selected: state.events.selected,
    }));

    return (
        <Root
            ref={(ref) => connect(drag(ref))}
            selected={selected}
            hovered={hovered}
            {...rootProps}
        >
            {children}
        </Root>
    );
};

export default Node;
