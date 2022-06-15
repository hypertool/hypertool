import type { IPath, IPathNode } from "../types";

interface IPathLevel {
    // ["<result>"]: IPathNode[];
    [key: string]: IPathLevel | IPathNode[];
}

/*
 * Sample usage:
 * ```js
 * console.log(
 *     JSON.stringify(
 *         createPathTree([
 *             {
 *                 key: "/components/button.tsx",
 *                 directory: false,
 *             },
 *             {
 *                 key: "/components/checkbox.tsx",
 *                 directory: false,
 *             },
 *             {
 *                 key: "/result",
 *                 directory: true,
 *             },
 *         ]),
 *         null,
 *         4,
 *     ),
 * );
 * ```
 */
export const createPathTree = (paths: IPath[]): IPathNode | null => {
    const level: IPathLevel = { "<result>": [] as IPathNode[] };

    paths.forEach((path) => {
        path.key.split("/").reduce(
            ((
                currentLevel: IPathLevel,
                name: string,
                index: number,
                array: string[],
            ) => {
                if (!currentLevel[name]) {
                    currentLevel[name] = { "<result>": [] };
                    (currentLevel["<result>"] as IPathNode[]).push({
                        name,
                        children: (currentLevel[name] as IPathLevel)[
                            "<result>"
                        ] as IPathNode[],
                        /* Attach the path object to the leaf node. */
                        path: index === array.length - 1 ? path : null,
                    });
                }

                return currentLevel[name];
            }) as any,
            level,
        );
    });

    const finalArray = level["<result>"] as IPathNode[];
    return finalArray.length > 0 ? finalArray[0] : null;
};
