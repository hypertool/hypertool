import type { Router, Request, Response, NextFunction } from "express";
import { constants } from "@hypertool/common";

import { queryEngine } from "../controllers";

const { httpStatuses } = constants;

const attachRoutes = (router: Router): void => {
    router.post(
        "/queries",
        async (request: Request, response: Response, next: NextFunction) => {
            try {
                const { body } = request;
                const result = await queryEngine.execute(body);
                response.status(httpStatuses.OK).json(result);
            } catch (error) {
                next(error);
            }
        },
    );

    router.get("/statuses/live", (request: Request, response: Response) => {
        response.status(httpStatuses.OK).json({
            message: "The @hypertool/query-engine service is active.",
        });
    });

    router.get("/statuses/ready", (request: Request, response: Response) => {
        response.status(httpStatuses.OK).json({
            message:
                "The @hypertool/query-engine service is ready to accept requests.",
        });
    });
};

export { attachRoutes };
