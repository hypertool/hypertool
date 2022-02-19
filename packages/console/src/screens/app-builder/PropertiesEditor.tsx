import { useEditor } from "@craftjs/core";
import React from "react";
import type { FunctionComponent, ReactElement } from "react";

const PropertiesEditor: FunctionComponent = (): ReactElement => {
    const { selected } = useEditor((state, query) => {
        const currentNodeId: any = state.events.selected;
        let selected;
        if (currentNodeId) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId]?.data?.name,
                settings:
                    state.nodes[currentNodeId]?.related &&
                    state.nodes[currentNodeId]?.related?.settings,
            };
        }

        return {
            selected,
        };
    });

    return (
        <>
            {selected &&
                selected.settings &&
                React.createElement(selected.settings)}
        </>
    );
};

export default PropertiesEditor;
