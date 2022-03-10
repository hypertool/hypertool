import {
    PatchListener,
    SubscriberAndCallbacksFor,
    useMethods,
} from "../../craft-utils";
import { DefaultEventHandlers } from "../events";
import {
    IEditorOptions,
    IEditorState,
    TNodeEventType,
    TNodeID,
} from "../interfaces";

import { ActionMethods } from "./actions";
import { QueryMethods } from "./query";

export const editorInitialState: IEditorState = {
    nodes: {},
    events: {
        dragged: new Set<TNodeID>(),
        selected: new Set<TNodeID>(),
        hovered: new Set<TNodeID>(),
    },
    indicator: null,
    handlers: null,
    options: {
        onNodesChange: () => null,
        onRender: ({ render }) => render,
        onBeforeMoveEnd: () => null,
        resolver: {},
        enabled: true,
        indicator: {
            error: "red",
            success: "rgb(98, 196, 98)",
        },
        handlers: (store) =>
            new DefaultEventHandlers({
                store,
                isMultiSelectEnabled: (e: MouseEvent) => !!e.metaKey,
            }),
        normalizeNodes: () => {
            return;
        },
    },
};

export const ActionMethodsWithConfig = {
    methods: ActionMethods,

    ignoreHistoryForActions: [
        "setDOM",
        "setNodeEvent",
        "selectNode",
        "clearEvents",
        "setOptions",
        "setIndicator",
    ] as const,

    normalizeHistory: (state: IEditorState): void => {
        /* On every undo/redo, we remove events pointing to deleted nodes. */
        (Object.keys(state.events) as TNodeEventType[]).forEach(
            (eventName: TNodeEventType) => {
                const nodeIds = Array.from(state.events[eventName] || []);

                nodeIds.forEach((id) => {
                    if (!state.nodes[id]) {
                        state.events[eventName].delete(id);
                    }
                });
            },
        );

        /*
         * Remove any invalid `node[nodeId].events`.
         * TODO(prev): it's really cumbersome to have to ensure `state.events`
         * and `state.nodes[nodeId].events` are in sync. Find a way to make it
         * so that once `state.events` is set, `state.nodes[nodeId]` automatically
         * reflects that. (Maybe using proxies?)
         */
        Object.keys(state.nodes).forEach((id) => {
            const node = state.nodes[id];

            (Object.keys(node.events) as TNodeEventType[]).forEach(
                (eventName: TNodeEventType) => {
                    const isEventActive = !!node.events[eventName];

                    if (
                        isEventActive &&
                        state.events[eventName] &&
                        !state.events[eventName].has(node.id)
                    ) {
                        node.events[eventName] = false;
                    }
                },
            );
        });
    },
};

export type TEditorStore = SubscriberAndCallbacksFor<
    typeof ActionMethodsWithConfig,
    typeof QueryMethods
>;

export const useEditorStore = (
    options: Partial<IEditorOptions>,
    patchListener: PatchListener<
        IEditorState,
        typeof ActionMethodsWithConfig,
        typeof QueryMethods
    >,
): TEditorStore => {
    // TODO: fix type
    return useMethods(
        ActionMethodsWithConfig,
        {
            ...editorInitialState,
            options: {
                ...editorInitialState.options,
                ...options,
            },
        },
        QueryMethods,
        patchListener,
    ) as TEditorStore;
};
