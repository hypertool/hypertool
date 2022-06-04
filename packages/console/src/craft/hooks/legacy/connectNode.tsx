import React from "react";

import { Node } from "../../interfaces";
import { useNode } from "../useNode";

export function connectNode<C>(collect?: (state: Node) => C) {
    return function (WrappedComponent: React.ElementType) {
        return (props: any) => {
            const node = useNode(collect);
            const WrappedComponent0 = WrappedComponent as any;
            return <WrappedComponent0 {...node} {...props} />;
        };
    };
}
