import type { IController, IExternalController } from "@hypertool/common";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toExternal = (controller: IController): IExternalController => {
    const { _id, creator, patches, status, createdAt, updatedAt } = controller;

    /*
     * NOTE: At the moment, all the controllers provide unpopulated fields.
     * Therefore, we consider all the IDs to be of type ObjectId.
     */
    return {
        id: _id.toString(),
        creator: creator.toString(),
        patches: patches.map((patch) => {
            const { author, content, createdAt } = patch;
            return {
                author: author.toString(),
                content,
                createdAt,
            };
        }),
        status,
        createdAt,
        updatedAt,
    };
};
