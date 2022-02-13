import type { MySQLConfiguration, Resource, Query } from "@hypertool/common";

import { QueryTemplateModel, ResourceModel } from "@hypertool/common";
import { Knex, knex } from "knex";

import type { ExecuteParameters } from "../types";

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
    const knexInstance = knex(config);

    if (typeof query.content === "object") {
        const queryContent: any = query.content;

        let queryResult;

        if (queryContent.hasOwnProperty("select") && queryContent.select) {
            queryResult = knexInstance.select(queryContent.select);
        } else if (
            queryContent.hasOwnProperty("insert") &&
            queryContent.insert
        ) {
            queryResult = knexInstance(queryContent.table).insert(
                queryContent.insert,
            );
        } else if (
            queryContent.hasOwnProperty("update") &&
            queryContent.update
        ) {
            queryResult = knexInstance(queryContent.table).update(
                queryContent.update,
            );
        } else if (
            queryContent.hasOwnProperty("delete") &&
            queryContent.delete
        ) {
            queryResult = knexInstance(queryContent.table).del(
                queryContent.delete,
            );
        }

        if (queryContent.hasOwnProperty("from") && queryContent.from) {
            queryResult = queryResult.from(queryContent.from);
        }

        if (queryContent.hasOwnProperty("where") && queryContent.where) {
            queryResult = queryResult.where(queryContent.where);
        }

        await queryResult();

        return queryResult[0];
    } else {
        const queryResult = await knexInstance.raw(
            query.content,
            queryRequest.variables,
        );
        return queryResult[0];
    }
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
            case "mysql":
            case "postgres": {
                const queryResult = await executeSQL(
                    queryRequest,
                    query,
                    resource,
                );
                return { result: queryResult };
            }
            default: {
                throw new Error("Unknown resource type");
            }
        }
    } catch (error) {
        throw error;
    }
};

export { execute };
