import express from "express";
import logger from "morgan";
import cors from "cors";

const initialize = async () => {
    const app = express();
    app.use(cors());

    if (process.env.NODE_ENV !== "production") {
        app.use(logger("dev"));
    }

    return app;
};

const destroy = () => {};

export { initialize, destroy };
