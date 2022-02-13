import bodyParser from "body-parser";
import express from "express";
import logger from "morgan";
import cors from "cors";

import { queryEngine } from "./rest";
import {
    QueryBadRequestError,
    QueryNotFoundError,
    QueryUnauthorizedError,
} from "./middleware";

const initialize = async () => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    // Attach router
    const router = express.Router();
    queryEngine.attachRoutes(router);
    app.use("/api/v1", router);

    // Attach error handlers
    app.use(QueryBadRequestError);
    app.use(QueryNotFoundError);
    app.use(QueryUnauthorizedError);

    if (process.env.NODE_ENV !== "production") {
        app.use(logger("dev"));
    }

    return app;
};

const destroy = () => {};

export { initialize, destroy };
