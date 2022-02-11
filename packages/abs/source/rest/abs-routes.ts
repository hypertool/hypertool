import type { Router, Request, Response, NextFunction } from "express";

const attachRoutes = (router: Router): void => {
    router.get("/statuses/live", (request: Request, response: Response) => {
        response.status(200).json({
            message: "The @hypertool/query-engine service is active.",
        });
    });

    router.get("/statuses/ready", (request: Request, response: Response) => {
        response.status(200).json({
            message: "The  service is ready to accept requests.",
        });
    });
};

export { attachRoutes };
