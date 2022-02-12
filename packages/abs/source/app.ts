import dotenv from "dotenv";
dotenv.config();

import express from "express";
import logger from "morgan";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { AppModel, NotFoundError, BadRequestError } from "@hypertool/common";

import { abs } from "./rest";

const { APP_BUNDLES_BUCKET_NAME, PROVIDER_DOMAIN } = process.env;

const initialize = async () => {
    const app = express();
    app.use(cors());

    if (process.env.NODE_ENV !== "production") {
        app.use(logger("dev"));
    }

    app.use(
        "/",
        createProxyMiddleware({
            target: `https://storage.googleapis.com/${APP_BUNDLES_BUCKET_NAME}`,
            changeOrigin: true,
            pathRewrite: async (path, request) => {
                const hostName = request.hostname;

                if (hostName.endsWith("." + PROVIDER_DOMAIN)) {
                    const appName = hostName.substring(
                        0,
                        hostName.length - PROVIDER_DOMAIN.length - 1,
                    );

                    const app = await AppModel.findOne({ name: appName });
                    if (!app) {
                        throw new NotFoundError(
                            "Cannot find an app with the specified name.",
                        );
                    }

                    const deploymentCount = app.deployments.length;
                    if (deploymentCount === 0) {
                        throw new NotFoundError(
                            "The requested application is undeployed. Please contact the administrator to deploy the app before continuing.",
                        );
                    }

                    const organizationId = (
                        app.organization as any
                    )?._id.toString();
                    const appId = app._id.toString();
                    const deploymentId =
                        app.deployments[deploymentCount - 1].toString();
                    const resolvedPath =
                        path === "" || path === "/" ? "index.html" : path;
                    return `${organizationId}/${appId}/${deploymentId}/${resolvedPath}`;
                }

                throw new BadRequestError(
                    "Custom domains are unsupported currently.",
                );
            },
        }),
    );

    const router = express.Router();
    abs.attachRoutes(router);
    app.use("/api/v1", router);

    return app;
};

const destroy = () => {};

export { initialize, destroy };
