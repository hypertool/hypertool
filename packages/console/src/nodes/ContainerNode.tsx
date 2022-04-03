import { ReactElement } from "react";

import { styled } from "@mui/material";

import { CraftComponent } from "../types";

interface IContainerProps {
    children?: ReactElement;
}

const Root = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 800,
    minWidth: 800,
    background: "#242424",
    margin: theme.spacing(2),
}));

const ContainerNode: CraftComponent<IContainerProps> = (
    props: IContainerProps,
): ReactElement => {
    return <Root>{props.children}</Root>;
};

ContainerNode.craft = {};

export default ContainerNode;
