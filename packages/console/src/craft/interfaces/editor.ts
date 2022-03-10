import {
    Delete,
    PatchListenerAction,
    QueryCallbacksFor,
} from "../../craft-utils";
import { QueryMethods } from "../editor/query";
import { ActionMethodsWithConfig, TEditorStore } from "../editor/store";
import { useInternalEditorReturnType } from "../editor/useInternalEditor";
import { CoreEventHandlers } from "../events";

import { Placement } from "./events";
import { Node, Nodes, TNodeEventType, TNodeID } from "./nodes";

export interface IEditorOptions {
    onRender: React.ComponentType<{ render: React.ReactElement }>;
    onBeforeMoveEnd: (
        targetNode: Node,
        newParentNode: Node,
        existingParentNode: Node,
    ) => void;
    onNodesChange: (query: QueryCallbacksFor<typeof QueryMethods>) => void;
    resolver: Resolver;
    enabled: boolean;
    indicator: Partial<{
        success: string;
        error: string;
        transition: string;
        thickness: number;
    }>;
    handlers: (store: TEditorStore) => CoreEventHandlers;
    normalizeNodes: (
        state: IEditorState,
        previousState: IEditorState,
        actionPerformed: Delete<
            PatchListenerAction<IEditorState, typeof ActionMethodsWithConfig>,
            "patches"
        >,
        query: QueryCallbacksFor<typeof QueryMethods>,
    ) => void;
}

export type Resolver = Record<string, string | React.ElementType>;

export interface Indicator {
    placement: Placement;
    error: string | null;
}

export type EditorEvents = Record<TNodeEventType, Set<TNodeID>>;

export interface IEditorState {
    nodes: Nodes;
    events: EditorEvents;
    options: IEditorOptions;
    handlers: CoreEventHandlers | null;
    indicator: Indicator | null;
}

export type ConnectedEditor<S = null> = useInternalEditorReturnType<S>;
