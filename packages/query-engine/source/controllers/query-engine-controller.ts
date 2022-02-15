import type { MySQLConfiguration, Resource, Query } from "@hypertool/common";

import { QueryTemplateModel, ResourceModel } from "@hypertool/common";
import { Knex, knex } from "knex";

import type { ExecuteParameters } from "../types";

import { QueryBuilder } from "../utils/query-builder";

const executeSQL = async (
    queryRequest: ExecuteParameters,
    query: Query,
    resource: Resource,
): Promise<any> => {
    const mySQLConfig: MySQLConfiguration = resource.mysql;
    const config: Knex.Config = {
        client: resource.type,
        connection: {
            host: mySQLConfig.host,
            port: mySQLConfig.port,
            user: mySQLConfig.databaseUserName,
            password: mySQLConfig.databasePassword,
            database: mySQLConfig.databaseName,
        },
    };
    let instance = knex(config);

    if (typeof query.content === "object") {
        const queryBuilder = new QueryBuilder(instance);
        instance = queryBuilder.parse(query.content);
        const queryResult = await instance();
        return queryResult[0];
    } else {
        const queryResult = await instance.raw(
            query.content,
            queryRequest.variables,
        );
        return queryResult[0];
    }
};

const execute = async (parameters: ExecuteParameters): Promise<any> => {
    const query: Query = await QueryTemplateModel.findOne({
        name: parameters.name,
    })
        .populate("resource")
        .exec();
    const resource: Resource = <Resource>query.resource;

    switch (resource.type) {
        case "mysql":
        case "postgres": {
            const queryResult = await executeSQL(parameters, query, resource);
            return { result: queryResult };
        }
        default: {
            throw new Error("Unknown resource type");
        }
    }
};

export { execute };
