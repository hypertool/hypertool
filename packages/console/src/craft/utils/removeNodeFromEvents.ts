import { IEditorState, TNodeEventType, TNodeID } from "../interfaces";

export const removeNodeFromEvents = (state: IEditorState, nodeId: TNodeID) =>
    (Object.keys(state.events) as TNodeEventType[]).forEach((key) => {
        const eventSet = state.events[key];
        if (eventSet && eventSet.has && eventSet.has(nodeId)) {
            state.events[key] = new Set(
                Array.from(eventSet).filter((id) => nodeId !== id),
            );
        }
    });
