import type { ExternalPage, Page, PagePage } from "@hypertool/common";
import {
    BadRequestError,
    NotFoundError,
    PageModel,
    constants,
} from "@hypertool/common";
import joi from "joi";

const createSchema = joi.object({
    app: joi.string().regex(constants.identifierPattern).required(),
    title: joi.string().max(128).min(1).required(),
    slug: joi.string().max(128).min(1).required(),
    description: joi.string().max(512).min(1),
});

const updateSchema = joi.object({
    title: joi.string().max(128).min(1).required(),
    slug: joi.string().max(128).min(1).required(),
    description: joi.string().max(512).min(1),
});

const filterSchema = joi.object({
    app: joi.string().regex(constants.identifierPattern).required(),
    page: joi.number().integer().default(0),
    limit: joi
        .number()
        .integer()
        .min(constants.paginateMinLimit)
        .max(constants.paginateMaxLimit)
        .default(constants.paginateMinLimit),
});

const toExternal = (page: any): ExternalPage => {
    const { _id, id, app, title, description, slug, createdAt, updatedAt } =
        page;
    return {
        id: _id.toString() || id,
        app,
        title,
        description,
        slug,
        createdAt,
        updatedAt,
    };
};
