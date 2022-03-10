/* eslint-disable @typescript-eslint/no-empty-function */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { DerivedEventHandlers, EventHandlers } from "@craftjs/utils";

import { TEditorStore } from "../editor/store";
import { INodeTree, TNodeID } from "../interfaces/nodes";

export interface CreateHandlerOptions {
    onCreate: (nodeTree: INodeTree) => void;
}

export class CoreEventHandlers<O = any> extends EventHandlers<
    { store: TEditorStore } & O
> {
    handlers() {
        return {
            connect: (_el: HTMLElement, _id: TNodeID) => {},
            select: (_el: HTMLElement, _id: TNodeID) => {},
            hover: (_el: HTMLElement, _id: TNodeID) => {},
            drag: (_el: HTMLElement, _id: TNodeID) => {},
            drop: (_el: HTMLElement, _id: TNodeID) => {},
            create: (
                _el: HTMLElement,
                _UserElement:
                    | React.ReactElement
                    | (() => INodeTree | React.ReactElement),
                _options?: Partial<CreateHandlerOptions>,
            ) => {},
        };
    }
}

export abstract class DerivedCoreEventHandlers<
    O = any,
> extends DerivedEventHandlers<CoreEventHandlers, O> {}
