import { useContext, useEffect, useMemo } from "react";

import {
    ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT,
    EventHandlerConnectors,
    QueryCallbacksFor,
    useCollector,
    useCollectorReturnType,
    wrapConnectorHooks,
} from "@craftjs/utils";
import invariant from "tiny-invariant";

import { CoreEventHandlers } from "../events/CoreEventHandlers";
import { useEventHandler } from "../events/EventContext";
import { IEditorState } from "../interfaces";

import { EditorContext } from "./EditorContext";
import { QueryMethods } from "./query";
import { TEditorStore } from "./store";

export type EditorCollector<C> = (
    state: IEditorState,
    query: QueryCallbacksFor<typeof QueryMethods>,
) => C;

export type useInternalEditorReturnType<C = null> = useCollectorReturnType<
    TEditorStore,
    C
> & {
    inContext: boolean;
    store: TEditorStore;
    connectors: EventHandlerConnectors<CoreEventHandlers, React.ReactElement>;
};

export function useInternalEditor<C>(
    collector?: EditorCollector<C>,
): useInternalEditorReturnType<C> {
    const handler = useEventHandler();
    const store = useContext(EditorContext);
    invariant(store, ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT);

    const collected = useCollector(store, collector);

    const connectorsUsage = useMemo(
        () => handler && handler.createConnectorsUsage(),
        [handler],
    );

    useEffect(() => {
        return () => {
            if (!connectorsUsage) {
                return;
            }

            connectorsUsage.cleanup();
        };
    }, [connectorsUsage]);

    const connectors = useMemo(
        () => connectorsUsage && wrapConnectorHooks(connectorsUsage.connectors),
        [connectorsUsage],
    );

    return {
        ...collected,
        connectors,
        inContext: !!store,
        store,
    };
}
