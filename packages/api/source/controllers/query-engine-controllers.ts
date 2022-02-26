import { BadRequestError, constants } from "@hypertool/common";

import axios from "axios";
import joi from "joi";

const { QUERY_ENGINE_URL } = process.env;

const executeSchema = joi.object({
    name: joi.string().max(128).required(),
    variables: joi.any().required(),
    format: joi
        .string()
        .valid(...constants.queryResultFormats)
        .required(),
});

const getQueryResult = async (
    context,
    attributes,
): Promise<{ result: any; error: any; meta: any }> => {
    const { error: requestError, value } = executeSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (requestError) {
        throw new BadRequestError(requestError.message);
    }

    const result = await axios.get(QUERY_ENGINE_URL, value);
    return result.data;
};

const getMetaData = async (context, appId: string): Promise<{ meta: any }> => {
    return null;
};

export { getQueryResult, getMetaData };
