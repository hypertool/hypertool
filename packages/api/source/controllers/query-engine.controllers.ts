import {
    BadRequestError,
    InternalServerError,
    constants,
} from "@hypertool/common";
import { QueryTemplateModel } from "@hypertool/common";
import type { IQueryTemplate, IResource } from "@hypertool/common";

import joi from "joi";
import { Knex } from "knex";

import type { IExecuteParameters, IQueryResult } from "../types";
import {
    QueryBuilder,
    QueryExecutionError,
    errorCodes,
    getConnection,
} from "../utils";

const executeSchema = joi.object({
    name: joi.string().max(128).required(),
    variables: joi.any().required(),
    format: joi
        .string()
        .valid(...constants.queryResultFormats)
        .required(),
});

const executeSQL = async (
    parameters: IExecuteParameters,
    query: IQueryTemplate,
    resource: IResource,
): Promise<any> => {
    const sql = resource[resource.type];
    const config: Knex.Config = {
        client: resource.type,
        connection: {
            host: sql.host,
            port: sql.port,
            user: sql.databaseUserName,
            password: sql.databasePassword,
            database: sql.databaseName,
        },
    };

    try {
        const connection =
            typeof query.content === "object"
                ? new QueryBuilder(config).parse(query.content)
                : getConnection(config);
        const result = await connection.raw(
            query.content,
            parameters.variables,
        );
        connection.destroy();
        return result.rows;
    } catch (error: any) {
        throw new QueryExecutionError(
            error.message || "An unknown error occurred while executing query.",
            errorCodes[error.code] || "UNKNOWN",
        );
    }
};

const execute = async (context, attributes): Promise<IQueryResult> => {
    const { error, value } = executeSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const query = await QueryTemplateModel.findOne({
        name: value.name,
    })
        .populate("resource")
        .exec();
    const resource = query.resource as IResource;
    switch (resource.type) {
        case "mysql":
        case "postgres": {
            return { result: await executeSQL(value, query, resource) };
        }
        default: {
            throw new InternalServerError(
                `Unknown resource type "${resource.type}".`,
            );
        }
    }
};

const getMetaData = async (context, appId: string): Promise<{ meta: any }> => {
    return null;
};

export { execute, getMetaData };
