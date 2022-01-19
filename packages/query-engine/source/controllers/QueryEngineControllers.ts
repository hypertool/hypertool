import mysql from "mysql2";

import type { Document } from "mongoose";

import { constants } from "../utils";
import { QueryTemplateModel, ResourceModel } from "../models";

const { httpStatuses } = constants;

function toExternal(result) {
    return {};
}

const attachRoutes = (router: any): void => {
    router.post("/mysql", async (request, response) => {
        const { name, variables, format } = request.body;

        const query = await QueryTemplateModel.findOne({
            name,
        }).exec();

        const { mysql: mySQLConfig } = await ResourceModel.findOne({
            _id: query.resource,
        }).exec();

        const connection = mysql.createConnection({
            host: mySQLConfig.host + ":" + mySQLConfig.port,
            user: mySQLConfig.databaseUserName,
            password: mySQLConfig.databasePassword,
            database: mySQLConfig.databaseName,
        });

        connection.connect();
        console.log(
            " ✅ Client MySQL database connection successfully established",
        );

        return response.status(httpStatuses.OK).json({ hello: "world" });
    });
};

export { attachRoutes };
