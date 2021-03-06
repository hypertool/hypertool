import { FunctionComponent, ReactElement } from "react";
import { useContext, useEffect, useMemo, useRef } from "react";

import { useEditor } from "../craft";
import { wrapConnectorHooks } from "../craft-utils";
import { useLayerEventHandler } from "../screens/app-builder/panels/explorer/events/LayerEventContext";
import { LayerManagerContext } from "../screens/app-builder/panels/explorer/manager";

import { LayerContext, TLayerContext } from "./LayerContext";
import { LayerNode } from "./LayerNode";

type Props = Omit<TLayerContext, "connectors">;

export const LayerContextProvider: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { id, depth } = props;
    const handlers = useLayerEventHandler();

    const { store } = useContext(LayerManagerContext);
    const storeRef = useRef(store);
    storeRef.current = store;

    const connectorsUsage = useMemo(
        () => handlers?.createConnectorsUsage(),
        [handlers],
    );

    const connectors = useMemo(
        () => wrapConnectorHooks((connectorsUsage as any).connectors),
        [connectorsUsage],
    );

    useEffect(() => {
        return () => {
            connectorsUsage?.cleanup();
        };
    }, [connectorsUsage]);

    const { exists } = useEditor((state) => ({
        exists: !!state.nodes[id],
    }));

    if (!exists) {
        return <></>;
    }

    return (
        <LayerContext.Provider value={{ id, depth, connectors }}>
            <LayerNode />
        </LayerContext.Provider>
    );
};
