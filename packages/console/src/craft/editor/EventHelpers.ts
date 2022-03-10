import { IEditorState, TNodeEventType, TNodeID } from "../interfaces";

export function EventHelpers(state: IEditorState, eventType: TNodeEventType) {
    const event = state.events[eventType];
    return {
        contains(id: TNodeID) {
            return event.has(id);
        },
        isEmpty() {
            return this.all().length === 0;
        },
        first() {
            const values = this.all();
            return values[0];
        },
        last() {
            const values = this.all();
            return values[values.length - 1];
        },
        all() {
            return Array.from(event);
        },
        size() {
            return this.all().length;
        },
        at(i: number) {
            return this.all()[i];
        },
        raw() {
            return event;
        },
    };
}
