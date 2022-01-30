import type { MySQLConfiguration, Resource, Query } from "@hypertool/common";

import { QueryTemplateModel, ResourceModel } from "@hypertool/common";
import { Knex, knex } from "knex";

import type { ExecuteParameters } from "../types";

const executeMySQL = async (
    queryRequest: ExecuteParameters,
    query: Query,
    resource: Resource,
): Promise<any> => {
    const mySQLConfig: MySQLConfiguration = resource.mysql;
    const config: Knex.Config = {
        client: "mysql",
        connection: {
            host: mySQLConfig.host,
            port: mySQLConfig.port,
            user: mySQLConfig.databaseUserName,
            password: mySQLConfig.databasePassword,
            database: mySQLConfig.databaseName,
        },
    };
    knex(config);
    // const knexQuery = knex.raw(query.query);
    return null;
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
