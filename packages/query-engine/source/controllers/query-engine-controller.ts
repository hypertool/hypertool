import type { MySQLConfiguration, Resource, Query } from "@hypertool/common";

import mysql from "mysql2/promise";
import { QueryTemplateModel, ResourceModel } from "@hypertool/common";
import { Knex, knex } from "knex";

import type { ExecuteParameters } from "../types";

const executeMySQL = async (
    queryRequest: ExecuteParameters,
    query: Query,
    resource: Resource,
): Promise<any> => {
    const mySQLConfig: MySQLConfiguration = resource.mysql;
    if (typeof query.content === "object") {
        const config: Knex.Config = {
            client: "mongodb",
            connection: {
                host: mySQLConfig.host,
                port: mySQLConfig.port,
                user: mySQLConfig.databaseUserName,
                password: mySQLConfig.databasePassword,
                database: mySQLConfig.databaseName,
            },
        };
        knex(config);
    }

    /**
     * Setting `namedPlaceholders to true when `variables` is an
     * object automatically makes the `execute` function handle
     * named parameters.
     */
    const connection = await mysql.createConnection({
        host: mySQLConfig.host,
        port: mySQLConfig.port,
        user: mySQLConfig.databaseUserName,
        // password: mySQLConfig.databasePassword,
        database: mySQLConfig.databaseName,
        namedPlaceholders:
            typeof queryRequest.variables === "object" ? true : false,
    });

    const [results, fields] = await connection.execute(
        query.content,
        queryRequest.variables,
    );

    return { results, fields };
};

const execute = async (queryRequest: ExecuteParameters): Promise<any> => {
    try {
        const query: Query = await QueryTemplateModel.findOne({
            name: queryRequest.name,
        }).exec();

        const resource: Resource = await ResourceModel.findOne({
            _id: query.resource,
        }).exec();

        switch (resource.type) {
            case "mysql": {
                const queryResult = await executeMySQL(
                    queryRequest,
                    query,
                    resource,
                );
                return queryResult;
            }
        }
    } catch (error) {
        throw error;
    }
};

export { execute };
