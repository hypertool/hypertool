import express, { Router, Request, Response } from "express";

const attachRoutes = (router: Router): void => {
    router.get(
        "/statuses/live",
        async (request: Request, response: Response) => {
            response
                .status(200)
                .json({ message: "The @hypertool/api service is active." });
        },
    );

    router.get(
        "/statuses/ready",
        async (request: Request, response: Response) => {
            response
                .status(200)
                .json({ message: "The  service is ready to accept requests." });
        },
    );
};

export { attachRoutes };
