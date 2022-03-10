import { INodeTree, Node, TNodeID } from "./nodes";

export type NodeInfo = {
    id: TNodeID;
} & DOMInfo;

export type DOMInfo = Record<
    | "x"
    | "y"
    | "top"
    | "left"
    | "bottom"
    | "right"
    | "width"
    | "height"
    | "outerWidth"
    | "outerHeight",
    number
> & {
    inFlow: boolean;
    margin: Record<"top" | "left" | "bottom" | "right", number>;
    padding: Record<"top" | "left" | "bottom" | "right", number>;
};

export interface DropPosition {
    parent: Node;
    index: number;
    where: string;
}

export type Placement = DropPosition & {
    currentNode: Node | null;
};

type ExistingDragTarget = {
    type: "existing";
    nodes: TNodeID[];
};

type NewDragTarget = {
    type: "new";
    tree: INodeTree;
};

export type DragTarget = ExistingDragTarget | NewDragTarget;
