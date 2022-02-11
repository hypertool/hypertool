import express from "express";
import logger from "morgan";
import cors from "cors";

import * as graphql from "./graphql";
import { api } from "./rest";

const initialize = async () => {
    const app = express();
    app.use(cors());

    if (process.env.NODE_ENV !== "production") {
        app.use(logger("dev"));
    }

    graphql.attachRoutes(app);
    const router = express.Router();
    api.attachRoutes(router);
    app.use("/api/v1", router);

    return app;
};

const destroy = () => {};

export { initialize, destroy };
