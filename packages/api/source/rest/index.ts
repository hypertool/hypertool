import { Router } from "express";

import * as memberships from "./membership-routes";
import * as statuses from "./status-routes";
import * as users from "./user-routes";

export const attachRoutes = async (app: any): Promise<void> => {
    const router = Router();
    app.use("/api/v1", router);

    await memberships.attachRoutes(router);
    await statuses.attachRoutes(router);
    await users.attachRoutes(router);
};
