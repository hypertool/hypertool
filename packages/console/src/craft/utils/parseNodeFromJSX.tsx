import React, { Fragment } from "react";

import { Node } from "../interfaces";

import { createNode } from "./createNode";

export function parseNodeFromJSX(
    jsx: React.ReactElement | string,
    normalize?: (node: Node, jsx: React.ReactElement) => void,
) {
    let element = jsx as React.ReactElement;

    if (typeof element === "string") {
        element = React.createElement(
            Fragment,
            {},
            element,
        ) as React.ReactElement;
    }

    const actualType = element.type as any;

    return createNode(
        {
            data: {
                type: actualType,
                props: { ...element.props },
            },
        },
        (node) => {
            if (normalize) {
                normalize(node, element);
            }
        },
    );
}
