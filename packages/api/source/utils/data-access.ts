import { AppModel, NotFoundError } from "@hypertool/common";
import type { IApp, IUser } from "@hypertool/common";

import { checkAccessToApps } from "./authorization";

export const accessApp = async (user: IUser, appId: string): Promise<IApp> => {
    const app = await AppModel.findOne({
        _id: appId,
        status: { $ne: "deleted" },
    }).exec();
    if (!app) {
        throw new NotFoundError(
            `Cannot find an app with the specified identifier "${appId}".`,
        );
    }

    checkAccessToApps(user, [app]);

    return app;
};
