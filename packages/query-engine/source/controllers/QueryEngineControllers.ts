import mysql from "mysql2";

import type {
    MySQLConfiguration,
    Resource,
    Query,
    QueryRequest,
} from "../types";

import { constants } from "../utils";
import { QueryTemplateModel, ResourceModel } from "../models";

const { httpStatuses } = constants;

const attachRoutes = (router: any): void => {
    router.post("/mysql", async (request, response) => {
        const queryRequest: QueryRequest = request.body;

        const query: Query = await QueryTemplateModel.findOne({
            name: queryRequest.name,
        }).exec();

        const resource: Resource = await ResourceModel.findOne({
            _id: query.resource,
        }).exec();

        const mySQLConfig: MySQLConfiguration = resource.mysql;

        const connection = mysql.createConnection({
            host: mySQLConfig.host,
            port: mySQLConfig.port,
            user: mySQLConfig.databaseUserName,
            password: mySQLConfig.databasePassword,
            database: mySQLConfig.databaseName,
            namedPlaceholders:
                typeof queryRequest.variables === "object" ? true : false,
        });

        connection.execute(
            query.content,
            queryRequest.variables,
            (error, results, fields) => {
                if (error) {
                    response.status(httpStatuses.UNAUTHORIZED).json({ error });
                } else {
                    response.status(httpStatuses.OK).json({ results, fields });
                }
            },
        );

        return response;
    });
};

export { attachRoutes };
