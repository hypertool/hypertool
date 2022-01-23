import type { Router, Request, Response, NextFunction } from "express";
import { constants } from "@hypertool/common";

import { queryEngine } from "../controllers";

const { httpStatuses } = constants;

const attachRoutes = (router: Router): void => {
    router.post(
        "/queries",
        async (request: Request, response: Response, next: NextFunction) => {
            const { body } = request;
            const result = await queryEngine.execute(body, next);
            response.status(httpStatuses.OK).json(result);
        },
    );
};

export { attachRoutes };
