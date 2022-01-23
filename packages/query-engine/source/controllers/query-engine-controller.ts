import type { MySQLConfiguration, Resource, Query } from "@hypertool/common";

import mysql from "mysql2/promise";
import { QueryTemplateModel, ResourceModel } from "@hypertool/common";
import { NextFunction } from "express";

import type { ExecuteParameters } from "../types";

const execute = async (
    queryRequest: ExecuteParameters,
    next: NextFunction,
): Promise<any> => {
    const query: Query = await QueryTemplateModel.findOne({
        name: queryRequest.name,
    }).exec();

    const resource: Resource = await ResourceModel.findOne({
        _id: query.resource,
    }).exec();

    const mySQLConfig: MySQLConfiguration = resource.mysql;

    const connection = await mysql.createConnection({
        host: mySQLConfig.host,
        port: mySQLConfig.port,
        user: mySQLConfig.databaseUserName,
        password: mySQLConfig.databasePassword,
        database: mySQLConfig.databaseName,
        namedPlaceholders:
            typeof queryRequest.variables === "object" ? true : false,
    });

    let queryResult: any;
    try {
        const [results, fields] = await connection.execute(
            query.content,
            queryRequest.variables,
        );
        queryResult = { results, fields };
    } catch (error) {
        next(error);
    }

    return queryResult;
};

export { execute };
