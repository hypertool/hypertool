import express from "express";
import logger from "morgan";

const initialize = async () => {
    const app = express();

    if (process.env.NODE_ENV !== "production") {
        app.use(logger("dev"));
    }

    return app;
};

const destroy = () => {};

export {
    initialize,
    destroy,
};