import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

dotenv.config({
    path: `${__dirname}/.env.test`,
});

before(async function () {
    const mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), {
        dbName: "test",
    });
    this.mongo = mongo;
});

beforeEach(async function () {
    await mongoose.connection.dropDatabase();
});

afterEach(async function () {});

after(async function () {
    await mongoose.connection.close();
    await this.mongo.stop();
});
