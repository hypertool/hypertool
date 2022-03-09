import {
    IExternalScreen,
    IScreen,
    TScreenPage,
    controller,
} from "@hypertool/common";
import {
    BadRequestError,
    NotFoundError,
    ScreenModel,
    constants,
} from "@hypertool/common";

import joi from "joi";

const createSchema = joi.object({
    app: joi.string().regex(constants.identifierPattern).required(),
    name: joi.string().regex(constants.namePattern).min(1).max(256).required(),
    title: joi.string().min(1).max(256).required(),
    description: joi.string().max(512).allow("").default(""),
    slug: joi.string().min(1).max(128).required(),
});

const updateSchema = joi.object({
    name: joi.string().regex(constants.namePattern).min(1).max(256),
    title: joi.string().min(1).max(256),
    description: joi.string().max(512),
    slug: joi.string().min(1).max(128),
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

const toExternal = (screen: IScreen): IExternalScreen => {
    const {
        _id,
        app,
        name,
        title,
        description,
        slug,
        status,
        createdAt,
        updatedAt,
    } = screen;
    return {
        id: _id.toString(),
        app: app.toString(),
        name,
        title,
        description,
        slug,
        status,
        createdAt,
        updatedAt,
    };
};

const create = async (context, attributes): Promise<IExternalScreen> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const newScreen = new ScreenModel({ ...value, status: "created" });
    await newScreen.save();

    return toExternal(newScreen);
};

const update = async (
    context,
    pageId: string,
    attributes,
): Promise<IExternalScreen> => {
    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const updatedPage = await ScreenModel.findByIdAndUpdate(
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

const list = async (context, parameters): Promise<TScreenPage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }
    const { page, limit, app } = value;

    const filters = { app };

    const pages = await (ScreenModel as any).paginate(filters, {
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
): Promise<IExternalScreen[]> => {
    const unorderedPages = await ScreenModel.find({
        _id: { $in: pageIds },
        app: appId,
    }).exec();

    const object = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const page of unorderedPages) {
        object[page._id.toString()] = page;
    }

    return pageIds.map((key) => toExternal(object[key]));
};

const helper = controller.createHelper({
    entity: "screen",
    model: ScreenModel,
    toExternal,
});

export const getById = async (
    context: any,
    appId: string,
    screenId: string,
): Promise<IExternalScreen> => helper.getById(context, screenId);

export const getByName = async (
    context: any,
    appId: string,
    name: string,
): Promise<IExternalScreen> => helper.getByName(context, name);

export { create, update, list, listById };
