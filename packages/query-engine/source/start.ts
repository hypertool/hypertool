import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";

import { initialize } from "./app";

dotenv.config({
    path: `${__dirname}/../../../.env`,
});

const { QE_PORT, DATABASE_URL } = process.env;

mongoose.set("debug", process.env.NODE_ENV !== "production");
mongoose.connection.once("open", async () => {
    console.log(" ✅ Database connection successfully established");
    const app = await initialize();
    http.createServer(app).listen(QE_PORT, () => {
        console.log(
            ` 🎉 You can access the server at http://localhost:${QE_PORT}`,
        );
    });
});
mongoose.connect(DATABASE_URL);
