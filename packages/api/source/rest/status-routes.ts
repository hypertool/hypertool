import { Request, Response, Router } from "express";

const attachRoutes = async (router: Router): Promise<void> => {
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
            response.status(200).json({
                message:
                    "The @hypertool/api service is ready to accept requests.",
            });
        },
    );
};

export { attachRoutes };
