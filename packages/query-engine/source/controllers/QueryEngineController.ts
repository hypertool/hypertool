import type {
    MySQLConfiguration,
    Resource,
    Query,
    QueryRequest,
} from "@hypertool/common";

import mysql from "mysql2";
import { QueryTemplateModel, ResourceModel } from "@hypertool/common";

const queryEngineController = async (queryRequest: QueryRequest) => {
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

    let queryResult: any;
    connection.execute(
        query.content,
        queryRequest.variables,
        (error, results, fields) => {
            if (error) {
                queryResult = { error };
            } else {
                queryResult = { results, fields };
            }
        },
    );

    return queryResult;
};

export default queryEngineController;
