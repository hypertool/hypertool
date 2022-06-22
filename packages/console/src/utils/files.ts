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

    /* The paths need to sorted to correctly assign path references. AFAIK,
     * this is a bruteforce approach and a quicker way may exist. Unfortunately,
     * I lack both intellect and time to solve this optimization.
     */
    [...paths]
        .sort((path1, path2) => path1.name.localeCompare(path2.name))
        .forEach((path) => {
            path.name
                .split("/")
                /* Get rid of all the prefix, suffix, and consecutive forward
                 * slashes to extract just the path elements.
                 */
                .filter(Boolean)
                .reduce(
                    ((currentLevel: IPathLevel, name: string) => {
                        if (!currentLevel[name]) {
                            currentLevel[name] = { "<result>": [] };
                            const ref = {
                                name,
                                children: (currentLevel[name] as IPathLevel)[
                                    "<result>"
                                ] as IPathNode[],
                                /* Attach the path object to the leaf node. */
                                path,
                            };
                            (currentLevel["<result>"] as IPathNode[]).push(
                                ref as any,
                            );
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
