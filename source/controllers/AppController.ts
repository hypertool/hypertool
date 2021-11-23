import joi from "joi";

import type { Member } from "../types";

import { constants } from "../utils";
import { App, ExternalApp } from "../types";

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
