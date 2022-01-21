import bodyParser from "body-parser";
import express from "express";
import logger from "morgan";
import cors from "cors";

const initialize = async () => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    const router = express.Router();
    app.use("/query-engine/v1", router);

    if (process.env.NODE_ENV !== "production") {
        app.use(logger("dev"));
    }

    return app;
};

const destroy = () => {};

export { initialize, destroy };
