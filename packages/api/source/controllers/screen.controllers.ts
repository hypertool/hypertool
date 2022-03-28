import {
    AppModel,
    ControllerModel,
    IExternalScreen,
    IScreen,
    TScreenPage,
    controller,
    runAsTransaction,
} from "@hypertool/common";
import {
    BadRequestError,
    NotFoundError,
    ScreenModel,
    constants,
} from "@hypertool/common";

import joi from "joi";
import mongoose from "mongoose";

const createSchema = joi.object({
    app: joi.string().regex(constants.identifierPattern).required(),
    name: joi.string().regex(constants.namePattern).min(1).max(256).required(),
    title: joi.string().min(1).max(256).required(),
    description: joi.string().max(512).allow("").default(""),
    slug: joi.string().regex(constants.slugPattern).required(),
    content: joi.string().allow("").default(""),
});

const updateSchema = joi.object({
    name: joi.string().regex(constants.namePattern).min(1).max(256),
    title: joi.string().min(1).max(256),
    description: joi.string().max(512).allow(""),
    slug: joi.string().regex(constants.slugPattern),
    content: joi.string().allow(""),
});

const filterSchema = joi.object({
    appId: joi.string().regex(constants.identifierPattern).required(),
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
        content,
        status,
        controller,
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
        content,
        status,
        controller:
            controller instanceof ControllerModel
                ? controller._id.toString()
                : controller.toString(),
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

    const newScreen = await runAsTransaction(async () => {
        const controllerId = new mongoose.Types.ObjectId();
        const newController = new ControllerModel({
            _id: controllerId,
            name: value.name,
            description: "",
            language: "javascript",
            creator: context.user._id,
            patches: [],
            status: "created",
        });

        const screenId = new mongoose.Types.ObjectId();
        const newScreen = new ScreenModel({
            ...value,
            _id: screenId,
            controller: controllerId,
            status: "created",
        });

        const [_newControllerResult, newScreenResult, updateAppResult] =
            await Promise.all([
                newController.save(),
                newScreen.save(),
                AppModel.findByIdAndUpdate(
                    value.app,
                    {
                        $push: {
                            screens: screenId,
                        },
                    },
                    {
                        new: true,
                        lean: true,
                    },
                ).exec(),
            ]);
        if (!updateAppResult) {
            throw new NotFoundError(`Cannot find app with the specified ID.`);
        }

        return newScreenResult;
    });

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
    const { page, limit /*appId*/ } = value;

    const filters = {
        /*
         * TODO: Filter based on app IDs
         * app: appId,
         */
    };

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

const helper = controller.createHelper({
    entity: "screen",
    model: ScreenModel,
    toExternal,
});

const listByIds = async (context, ids: string[]): Promise<IExternalScreen[]> =>
    helper.listByIds(context, ids);

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

export { create, update, list, listByIds };
