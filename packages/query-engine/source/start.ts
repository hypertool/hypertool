import dotenv from "dotenv";
dotenv.config();

import http from "http";
import mongoose from "mongoose";

import { initialize } from "./app";

const { PORT, DATABASE_URL } = process.env;

mongoose.set("debug", true);
mongoose.connection.once("open", async () => {
    console.log(" ✅ Database connection successfully established");
    const app = await initialize();
    http.createServer(app).listen(PORT, () => {
        console.log(
            ` 🎉 You can access the server at http://localhost:${PORT}`,
        );
    });
});
mongoose.connect(DATABASE_URL);
