import express from "express";
import logger from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

import { api } from "./rest";
import * as graphql from "./graphql";
import { memberships } from "./rest";

const initialize = async () => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    if (process.env.NODE_ENV !== "production") {
        app.use(logger("dev"));
    }

    graphql.attachRoutes(app);

    const router = express.Router();
    api.attachRoutes(router);
    memberships.attachRoutes(router);
    app.use("/api/v1", router);

    return app;
};

const destroy = () => {};

export { initialize, destroy };
