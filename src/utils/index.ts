import type { ICraftNode, INode, TCraftNodeKey } from "../types";

export const inflateDocument = (document: Record<string, ICraftNode>) => {
  const keys: TCraftNodeKey[] = Object.keys(document) as TCraftNodeKey[];

  /* A map that temporarily hosts the new nodes that are inflated. */
  const map = new Map<string, INode>(
    keys.map((key: string) => {
      const { type, props } = document[key];
      return [
        key,
        {
          internalId: key,
          type: type.resolvedName,
          props,
          children: [],
          __hyperNode: true,
        },
      ];
    })
  );

  /* For each new node corresponding to the old nodes in the document,
   * establish parental links from the child to the parent.
   */
  for (const key of keys) {
    const node = document[key];
    if (node.parent) {
      const parentNode = map.get(node.parent);
      if (parentNode) {
        parentNode.children.push(map.get(key)!);
      }
    }
  }

  /* Return the new root node. We assume that the root node is always named "ROOT". */
  return map.get("ROOT")!;
};

export * as events from "./events";
export * as constants from "./constants";

export type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T;

export const truthy = <T>(value: T): value is Truthy<T> => {
    return !!value;
};