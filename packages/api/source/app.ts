import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";

import * as graphql from "./graphql";
import * as rest from "./rest";

const initialize = async () => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    if (process.env.NODE_ENV !== "production") {
        app.use(logger("dev"));
    }

    graphql.attachRoutes(app);
    rest.attachRoutes(app);

    return app;
};

const destroy = () => {};

export { initialize, destroy };
