import { useEditor } from "@craftjs/core";
import React from "react";
import type { FunctionComponent, ReactElement } from "react";

const PropertiesEditor: FunctionComponent = (): ReactElement => {
    const { selected } = useEditor((state, query) => {
        const currentNodeId: any = state.events.selected;
        let selected;
        if (currentNodeId) {
            selected = {
                id: currentNodeId.values().next().value,
                name: state.nodes[currentNodeId.values().next().value]?.data
                    ?.name,
                settings:
                    state.nodes[currentNodeId.values().next().value]?.related &&
                    state.nodes[currentNodeId.values().next().value]?.related
                        ?.settings,
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
