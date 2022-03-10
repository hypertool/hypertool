import React from "react";

import { TNodeID } from "../interfaces";
import { RenderNodeToElement } from "../render/RenderNode";

import { NodeProvider } from "./NodeContext";

export type NodeElementProps = {
    id: TNodeID;
    render?: React.ReactElement;
};

export const NodeElement: React.FC<NodeElementProps> = ({ id, render }) => {
    return (
        <NodeProvider id={id}>
            <RenderNodeToElement render={render} />
        </NodeProvider>
    );
};
