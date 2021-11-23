import joi from "joi";

import { constants } from "../utils";

const createSchema = joi.object({
  name: joi.string().min(1).max(128).allow(""),
  description: joi.string().min(0).max(512).allow(""),
  members: joi.array().items(joi.string().regex(constants.identifierPattern)),
  resources: joi.array().items(joi.string().regex(constants.identifierPattern)),
  creator: joi.string().regex(constants.identifierPattern),
});
