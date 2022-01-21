import { constants } from "@hypertool/common";

import type { Router, Request, Response } from "express";

import { queryEngine } from "../controllers";

const { httpStatuses } = constants;

const attachRoutes = (router: Router): void => {
    router.post("/queries", async (request: Request, response: Response) => {
        const { body } = request;
        const result = await queryEngine.execute(body);
        response.status(httpStatuses.OK).json(result);
    });
};

export { attachRoutes };
