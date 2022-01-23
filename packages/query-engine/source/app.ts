import bodyParser from "body-parser";
import express from "express";
import logger from "morgan";
import cors from "cors";

import { queryEngine } from "./rest";

const initialize = async () => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    const router = express.Router();
    queryEngine.attachRoutes(router);
    app.use("/api/v1", router);

    if (process.env.NODE_ENV !== "production") {
        app.use(logger("dev"));
    }

    return app;
};

const destroy = () => {};

export { initialize, destroy };
