import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";

import {
    queryBadRequestError,
    queryNotFoundError,
    queryUnauthorizedError,
} from "./middleware";
import { queryEngine } from "./rest";

const initialize = async () => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    // Attach router
    const router = express.Router();
    queryEngine.attachRoutes(router);
    app.use("/api/v1", router);

    // Attach error handlers
    app.use(queryBadRequestError);
    app.use(queryNotFoundError);
    app.use(queryUnauthorizedError);

    if (process.env.NODE_ENV !== "production") {
        app.use(logger("dev"));
    }

    return app;
};

const destroy = () => {};

export { initialize, destroy };
