import { ReactElement } from "react";

import { styled } from "@mui/material";

import { CraftComponent } from "../types";

import Node from "./Node";

interface IContainerProps {
    children?: ReactElement;
}

const Root = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    minHeight: 400,
    background: "#242424",
    margin: theme.spacing(1),
}));

const ContainerNode: CraftComponent<IContainerProps> = (
    props: IContainerProps,
): ReactElement => {
    return (
        <Node>
            <Root>{props.children}</Root>
        </Node>
    );
};

ContainerNode.craft = {};

export default ContainerNode;
