import mysql from "mysql2";

import { constants } from "../utils";
import { QueryTemplateModel, ResourceModel } from "../models";

const { httpStatuses } = constants;

const attachRoutes = (router: any): void => {
    router.post("/mysql", async (request, response) => {
        const { name, variables } = request.body;

        const query = await QueryTemplateModel.findOne({
            name,
        }).exec();

        const resource = await ResourceModel.findOne({
            _id: query.resource,
        }).exec();

        const mySQLConfig = resource.mysql;

        const connection = mysql.createConnection({
            host: mySQLConfig.host,
            port: mySQLConfig.port,
            user: mySQLConfig.databaseUserName,
            password: mySQLConfig.databasePassword,
            database: mySQLConfig.databaseName,
            namedPlaceholders: typeof variables === "object" ? true : false,
        });

        connection.execute(
            query.content,
            variables,
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
