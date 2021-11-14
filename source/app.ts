import express from "express";

const initialize = async () => {
    const app = express();
    return app;
};

const destroy = () => {};

export {
    initialize,
    destroy,
};