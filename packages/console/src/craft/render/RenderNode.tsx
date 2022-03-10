import React from "react";

import { useInternalEditor } from "../editor/useInternalEditor";
import { useInternalNode } from "../nodes/useInternalNode";

import { DefaultRender } from "./DefaultRender";

type RenderNodeToElementType = {
    render?: React.ReactElement;
};
export const RenderNodeToElement: React.FC<RenderNodeToElementType> = ({
    render,
}) => {
    const { hidden } = useInternalNode((node) => ({
        hidden: node.data.hidden,
    }));

    const { onRender } = useInternalEditor((state) => ({
        onRender: state.options.onRender,
    }));

    // don't display the node since it's hidden
    if (hidden) {
        return null;
    }

    return React.createElement(onRender, {
        render: render || <DefaultRender />,
    });
};
