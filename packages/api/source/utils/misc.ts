import { BadRequestError } from "@hypertool/common";

import joi from "joi";

export const validateAttributes = <T>(
    schema: joi.ObjectSchema<T>,
    attributes: any,
): T => {
    const { error, value } = schema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }
    return value;
};
