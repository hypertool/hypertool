import type { Router, Request, Response, NextFunction } from "express";
import { constants } from "@hypertool/common";

import { memberships } from "../controllers";

const { httpStatuses } = constants;

const attachRoutes = (router: Router): void => {
    router.get(
        "/invitation/accept/:jwt",
        async (request: Request, response: Response, next: NextFunction) => {
            const { jwt } = request.params;
            const result = await memberships.verify(null, jwt);

            if (result) {
                return response
                    .status(httpStatuses.OK)
                    .json({ message: "Invitation acepted." });
            } else {
                return response
                    .status(httpStatuses.BAD_REQUEST)
                    .json({ message: "Invitation link has expired." });
            }
        },
    );
};

export { attachRoutes };
