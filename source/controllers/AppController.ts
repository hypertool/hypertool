import joi from "joi";

import type { App, ExternalApp, Member } from "../types";

import { constants, BadRequestError } from "../utils";
import { AppModel } from "../models";

const createSchema = joi.object({
  name: joi.string().min(1).max(128).allow(""),
  description: joi.string().min(0).max(512).allow(""),
  members: joi.array().items(joi.string().regex(constants.identifierPattern)),
  resources: joi.array().items(joi.string().regex(constants.identifierPattern)),
  creator: joi.string().regex(constants.identifierPattern),
});

const toExternal = (app: App): ExternalApp => {
  const { name, description, members, resources, creator, status } = app;

  return {
    name,
    description,
    members:
      members.length > 0
        ? typeof members[0] === "string"
          ? members
          : members.map((member) => member.id)
        : [],
    resources:
      resources.length > 0
        ? typeof resources[0] === "string"
          ? resources
          : resources.map((member) => member.id)
        : [],
    creator: typeof creator === "string" ? creator : (creator as Member).id,
    status,
  };
};

const create = async (context, attributes): Promise<ExternalApp> => {
  const { error, value } = createSchema.validate(attributes, {
    stripUnknown: true,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  // TODO: Check if value.members, value.resources, and value.creator is correct.
  const newApp = new AppModel({
    ...value,
    status: "private",
  });
  await newApp.save();

  return toExternal(newApp);
};

export { create };
