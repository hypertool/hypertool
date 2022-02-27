import type { FunctionComponent } from "react";
import {
    createElement,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import { ROOT_NODE, useEditor } from "@craftjs/core";

import { useLayerManager } from "../manager/useLayerManager";

import { LayerContextProvider } from "./LayerContextProvider";
import { useLayer } from "./useLayer";

export const LayerNode: FunctionComponent = () => {
    const { id, depth, children, expanded } = useLayer((layer) => ({
        expanded: layer.expanded,
    }));

    const { data, shouldBeExpanded } = useEditor((state, query) => {
        // TODO: handle multiple selected elements
        const selected = query.getEvent("selected").first();

        return {
            data: state.nodes[id] && state.nodes[id].data,
            shouldBeExpanded:
                selected && query.node(selected).ancestors(true).includes(id),
        };
    });

    const {
        actions: { registerLayer, toggleLayer },
        renderLayer,
        expandRootOnLoad,
    } = useLayerManager((state) => ({
        renderLayer: state.options.renderLayer,
        expandRootOnLoad: state.options.expandRootOnLoad,
    }));

    const [isRegistered, setRegistered] = useState(false);

    useLayoutEffect(() => {
        registerLayer(id);
        setRegistered(true);
    }, [registerLayer, id]);

    const expandedRef = useRef<boolean>(expanded);
    expandedRef.current = expanded;

    const shouldBeExpandedOnLoad = useRef<boolean>(
        expandRootOnLoad && id === ROOT_NODE,
    );

    useEffect(() => {
        if (!expandedRef.current && shouldBeExpanded) {
            toggleLayer(id);
        }
    }, [toggleLayer, id, shouldBeExpanded]);

    useEffect(() => {
        if (shouldBeExpandedOnLoad.current) {
            toggleLayer(id);
        }
    }, [toggleLayer, id]);

    return data && isRegistered ? (
        <div className={`craft-layer-node ${id}`}>
            {createElement(
                renderLayer,
                {},
                children && expanded
                    ? children.map((id: any) => (
                          <LayerContextProvider
                              key={id}
                              id={id}
                              depth={depth + 1}
                          />
                      ))
                    : null,
            )}
        </div>
    ) : null;
};
