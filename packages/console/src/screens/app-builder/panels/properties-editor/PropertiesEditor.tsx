import React from "react";
import type { FunctionComponent, ReactElement } from "react";

import { useEditor } from "@craftjs/core";

const PropertiesEditor: FunctionComponent = (): ReactElement => {
    const { selected } = useEditor((state) => {
        const currentNodeId: Set<string> = state.events.selected;
        if (currentNodeId) {
            const id = currentNodeId.values().next().value;
            const node = state.nodes[id];
            if (node) {
                return {
                    selected: {
                        id,
                        name: node.data?.name,
                        settings: node.related?.settings,
                    },
                };
            }
        }

        return {
            selected: false,
        };
    }) as any;

    return (
        <>
            {selected?.settings &&
                React.createElement((selected as any).settings)}
        </>
    );
};

export default PropertiesEditor;
