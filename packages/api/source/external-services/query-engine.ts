import joi from "joi";
import { constants, BadRequestError } from "@hypertool/common";

const querySchema = joi.object({
    name: joi.string().max(128).required(),
    variables: joi.any(),
    format: joi.string(),
});

const getQueryResult = async (
    context,
    attributes,
): Promise<{ result: any; error: any; meta: any }> => {
    const { error, value } = querySchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    // TODO: Check if value.members and value.resources are correct.
    // const result = // TODO: Get result from external service.
    return null;
};

const getMetaData = async (context, appId: string): Promise<{ meta: any }> => {
    return null;
};

export { getQueryResult };
