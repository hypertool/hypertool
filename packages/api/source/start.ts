import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";

import { initialize } from "./app";

dotenv.config({
    path: `${__dirname}/../../../.env`,
});

const { API_PORT, PORT, DATABASE_URL } = process.env;

mongoose.set("debug", true);
mongoose.connection.once("open", async () => {
    console.log(" ✅ Database connection successfully established");
    const app = await initialize();
    http.createServer(app).listen(PORT || API_PORT || 3000, () => {
        console.log(
            ` 🎉 You can access the server at http://localhost:${API_PORT}`,
        );
    });
});
mongoose.connect(DATABASE_URL);
