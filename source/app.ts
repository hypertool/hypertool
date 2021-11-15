import express from "express";
import logger from "morgan";
import cors from "cors";

import * as graphql from "./graphql";

const initialize = async () => {
    const app = express();
    app.use(cors());

    if (process.env.NODE_ENV !== "production") {
        app.use(logger("dev"));
    }

    graphql.attachRoutes(app);

    return app;
};

const destroy = () => {};

export {
    initialize,
    destroy,
};