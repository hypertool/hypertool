import type { Router, Request, Response, NextFunction } from "express";
import { constants } from "@hypertool/common";

import { memberships } from "../controllers";

const { httpStatuses } = constants;
const { INVITATION_JWT_SIGNATURE } = process.env;

const attachRoutes = (router: Router): void => {
    router.get(
        "/invitation/accept/:jwt",
        async (request: Request, response: Response, next: NextFunction) => {
            const { jwt } = request.params;
            const result = await memberships.verify(
                INVITATION_JWT_SIGNATURE,
                jwt,
            );

            if (result) {
                return response
                    .status(httpStatuses.OK)
                    .json({ message: "Invitation accepted." });
            } else {
                return response
                    .status(httpStatuses.BAD_REQUEST)
                    .json({ message: "Invitation link has expired." });
            }
        },
    );
};

export { attachRoutes };