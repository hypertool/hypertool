import dotenv from "dotenv";
dotenv.config({
    path: `${__dirname}/../../../.env`,
});

import http from "http";
import mongoose from "mongoose";

import { initialize } from "./app";

const { ABS_PORT, DATABASE_URL } = process.env;

mongoose.set("debug", true);
mongoose.connection.once("open", async () => {
    console.log(" ✅ Database connection successfully established");
    const app = await initialize();
    http.createServer(app).listen(ABS_PORT, () => {
        console.log(
            ` 🎉 You can access the server at http://localhost:${ABS_PORT}`,
        );
    });
});
mongoose.connect(DATABASE_URL);
