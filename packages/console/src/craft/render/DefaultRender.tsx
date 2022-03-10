import React, { useMemo } from "react";

import { TNodeID } from "../interfaces";
import { NodeElement } from "../nodes/NodeElement";
import { useInternalNode } from "../nodes/useInternalNode";

import { SimpleElement } from "./SimpleElement";

export const DefaultRender = () => {
    const { type, props, nodes, hydrationTimestamp } = useInternalNode(
        (node) => ({
            type: node.data.type,
            props: node.data.props,
            nodes: node.data.nodes,
            hydrationTimestamp: node._hydrationTimestamp,
        }),
    );

    return useMemo(() => {
        let { children } = props;

        if (nodes && nodes.length > 0) {
            children = (
                <React.Fragment>
                    {nodes.map((id: TNodeID) => (
                        <NodeElement id={id} key={id} />
                    ))}
                </React.Fragment>
            );
        }

        const render = React.createElement(type, props, children);

        if (typeof type == "string") {
            return <SimpleElement render={render} />;
        }

        return render;
    }, [type, props, hydrationTimestamp, nodes]);
};
