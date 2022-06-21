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
 *                 name: "/components/button.tsx",
 *                 directory: false,
 *             },
 *             {
 *                 name: "/components/checkbox.tsx",
 *                 directory: false,
 *             },
 *             {
 *                 name: "/result",
 *                 directory: true,
 *             },
 *         ]),
 *         null,
 *         4,
 *     ),
 * );
 * ```
 */
export const createPathTree = (
    paths: IPath[],
    multipleRoots = false,
): IPathNode | IPathNode[] | null => {
    if (paths.length === 0) {
        return null;
    }

    const level: IPathLevel = { "<result>": [] as IPathNode[] };

    paths.forEach((path) => {
        (path.name[0] === "/" ? path.name.replace("/", "") : path.name)
            .split("/")
            .reduce(
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

    if (multipleRoots) {
        return finalArray;
    }

    if (finalArray.length > 1 && !multipleRoots) {
        throw new Error(
            `Expected a single root, but found multiple roots (${finalArray.length})!`,
        );
    }

    return finalArray[0];
};
