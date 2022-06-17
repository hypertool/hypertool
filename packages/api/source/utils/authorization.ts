import type {
    IApp,
    ISourceFile,
    IQueryTemplate,
    IResource,
    IUser,
} from "@hypertool/common";
import { ForbiddenError, InternalServerError } from "@hypertool/common";

import mongoose from "mongoose";

import type { IAuthResourceGroup, TAccessType } from "../types";

const groups: IAuthResourceGroup[] = [
    {
        name: "appBuilder",
        resources: [
            {
                name: "sourceFiles",
                operations: [
                    {
                        name: "create",
                        test: (user, app) =>
                            user._id.toString() === app.creator.toString(),
                    },
                    {
                        name: "list",
                        test: (user, app) =>
                            user._id.toString() === app.creator.toString(),
                    },
                    {
                        name: "listByIds",
                        test: (user, items) => {
                            const userId = user._id.toString();
                            for (const item of items) {
                                if (item.creator.toString() !== userId) {
                                    return false;
                                }
                            }
                            return true;
                        },
                    },
                    {
                        name: "view",
                        test: (user, context) =>
                            user._id.toString() === context.id.toString(),
                    },
                    {
                        name: "update",
                        test: (user, context) =>
                            user._id.toString() === context.id.toString(),
                    },
                    {
                        name: "delete",
                        test: (user, context) =>
                            user._id.toString() === context.id.toString(),
                    },
                ],
            },
        ],
    },
];

const checkPermission = async (
    permission: string,
    user: IUser,
    context?: any,
): Promise<boolean> => {
    const [groupName, resourceName, operationName] = permission.split(".");

    const group = groups.find((group) => group.name === groupName);
    if (!group) {
        throw new InternalServerError(
            `Unknown resource group "${groupName}" in permission "${permission}".`,
        );
    }

    const resource = group.resources.find(
        (resource) => resource.name === resourceName,
    );
    if (!resource) {
        throw new InternalServerError(
            `Unknown resource "${resourceName}" in permission "${permission}".`,
        );
    }

    const operation = resource.operations.find(
        (operation) => operation.name === operationName,
    );
    if (!operation) {
        throw new InternalServerError(
            `Unknown operation "${operationName}" in permission "${permission}".`,
        );
    }

    return await operation.test(user, context);
};

export const checkPermissions = (
    user: IUser,
    permissions: string | string[],
    contexts: any[] = [],
): void => {
    const permissions0 =
        typeof permissions === "string" ? permissions.split(",") : permissions;
    if (permissions0.length !== contexts.length) {
        throw new Error("Permissions and contexts must have the same length.");
    }

    const deniedList = [];
    for (let i = 0; i < permissions0.length; i++) {
        const permission = permissions0[i];
        const context = contexts[i];
        if (!checkPermission(permission, user, context)) {
            deniedList.push(permission);
        }
    }

    if (deniedList.length > 0) {
        throw new ForbiddenError(
            `The following permissions are required to complete the requested operation: ${deniedList.join(
                ", ",
            )}.`,
        );
    }
};

export const checkAccessToApps = (user: IUser, apps: IApp[]): void => {
    // TODO: Handle anonymous users.
    if (!user) {
        return;
    }

    const userId = user._id.toString();
    const deniedList = [];
    for (const app of apps) {
        if (app.creator.toString() !== userId) {
            deniedList.push(app._id.toString());
        }
    }

    if (deniedList.length > 0) {
        throw new ForbiddenError(
            `Access to the following apps are forbidden: ${deniedList.join(
                ", ",
            )}`,
        );
    }
};

export const checkAccessToControllers = (
    user: IUser,
    sourceFiles: ISourceFile[],
): void => {
    // TODO: Handle anonymous users.
    if (!user) {
        return;
    }

    const userId = user._id.toString();
    const deniedList = [];
    for (const controller of sourceFiles) {
        if (controller.creator.toString() !== userId) {
            deniedList.push(controller._id.toString());
        }
    }

    if (deniedList.length > 0) {
        throw new ForbiddenError(
            `Access to the following sourceFiles are forbidden: ${deniedList.join(
                ", ",
            )}`,
        );
    }
};

export const checkAccessToResources = (
    user: IUser,
    resources: IResource[],
): void => {
    // TODO: Handle anonymous users.
    if (!user) {
        return;
    }

    const userId = user._id.toString();
    const deniedList = [];
    for (const resource of resources) {
        if (resource.creator.toString() !== userId) {
            deniedList.push(resource._id.toString());
        }
    }

    if (deniedList.length > 0) {
        throw new ForbiddenError(
            `Access to the following resources are forbidden: ${deniedList.join(
                ", ",
            )}`,
        );
    }
};

export const checkAccessToQueryTemplates = (
    user: IUser,
    queryTemplates: IQueryTemplate[],
): void => {
    // TODO: Handle anonymous users.
    if (!user) {
        return;
    }

    const userId = user._id.toString();
    const deniedList = [];
    for (const queryTemplate of queryTemplates) {
        if (queryTemplate.creator.toString() !== userId) {
            deniedList.push(queryTemplate._id.toString());
        }
    }

    if (deniedList.length > 0) {
        throw new ForbiddenError(
            `Access to the following query templates are forbidden: ${deniedList.join(
                ", ",
            )}`,
        );
    }
};

export const checkAccessToUsers = (
    currentUser: IUser,
    users: IUser[] | IUser,
    type: TAccessType,
): void => {
    const users0 = Array.isArray(users) ? users : [users];
    const currentUserId = currentUser._id.toString();
    const deniedList = [];

    for (const user of users0) {
        const userId = user._id.toString();

        switch (type) {
            /*
             * Only the following actors can read/write user data:
             * 1. The owner of the application to which the user belongs.
             * 2. The user itself.
             */
            case "read":
            case "write": {
                if (!(user.app as IApp)?._id) {
                    throw new InternalServerError(
                        "The `user.app` attribute should be populated.",
                    );
                }

                const app = user.app as IApp;
                /* NOTE: `creator` could either be a populated user or ObjectId. */
                const appCreatorId = (
                    (app.creator as IUser)._id ||
                    (app.creator as mongoose.Schema.Types.ObjectId)
                ).toString();
                if (
                    appCreatorId !== currentUserId &&
                    userId !== currentUserId
                ) {
                    deniedList.push(userId);
                }

                break;
            }

            /* All the other access types are denied. */
            default: {
                deniedList.push(userId);
            }
        }
    }

    if (deniedList.length > 0) {
        throw new ForbiddenError(
            `${type.toUpperCase()} access to the following users are forbidden: ${deniedList.join(
                ", ",
            )}`,
        );
    }
};
