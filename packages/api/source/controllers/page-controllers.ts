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

const create = async (context, attributes): Promise<ExternalPage> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const newPage = new PageModel({ ...value });

    await newPage.save();

    return toExternal(newPage);
};

const update = async (
    context,
    pageId: string,
    attributes,
): Promise<ExternalPage> => {
    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const updatedPage = await PageModel.findByIdAndUpdate(
        pageId,
        { ...value },
        { new: true },
    );

    if (!updatedPage) {
        throw new NotFoundError(
            "A page with the specified identifier does not exist.",
        );
    }

    return toExternal(updatedPage);
};

const list = async (context, parameters): Promise<PagePage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }
    console.log(value);
    const { page, limit, app } = value;

    const filters = { app };

    const pages = await (PageModel as any).paginate(filters, {
        limit,
        page: page + 1,
        lean: true,
        leanWithId: true,
        pagination: true,
        sort: {
            updatedAt: -1,
        },
    });

    return {
        totalRecords: pages.totalDocs,
        totalPages: pages.totalPages,
        previousPage: pages.prevPage ? pages.prevPage - 1 : -1,
        nextPage: pages.nextPage ? pages.nextPage - 1 : -1,
        hasPreviousPage: pages.hasPrevPage,
        hasNextPage: pages.hasNextPage,
        records: pages.docs.map(toExternal),
    };
};

const listById = async (
    context,
    appId: string,
    pageIds: string[],
): Promise<ExternalPage[]> => {
    const unorderedPages = await PageModel.find({
        _id: { $in: pageIds },
        app: appId,
    }).exec();

    const object = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const page of unorderedPages) {
        object[page._id.toString()] = page;
    }

    // eslint-disable-next-line security/detect-object-injection
    return pageIds.map((key) => toExternal(object[key]));
};

export { create, update, list, listById };
