import type { Document } from "mongoose";
import joi from "joi";
import type { ActivityLog, ExternalActivityLog, ResourcePage } from "../types";
import { constants, BadRequestError, NotFoundError } from "../utils";
import { ActivityLogModel } from "../models";
const { componentOrigins } = constants;

const createSchema = joi.object({
    message: joi.string().max(512).min(1).required(),
    component: joi
        .string()
        .valid(...componentOrigins)
        .required(),
    context: joi
        .object({
            type: joi.string(),
        })
        .unknown(true),
});
