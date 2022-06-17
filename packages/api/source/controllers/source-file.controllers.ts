import {
    ISourceFile,
    IExternalSourceFile,
    InternalServerError,
    TSourceFilePage,
    runAsTransaction,
} from "@hypertool/common";
import {
    AppModel,
    BadRequestError,
    SourceFileModel,
    NotFoundError,
    constants,
} from "@hypertool/common";

import { createTwoFilesPatch } from "diff";
import { appendFile } from "fs";
import joi from "joi";
import { ClientSession, Types } from "mongoose";

import {
    checkAccessToApps,
    checkAccessToSourceFiles,
    patchAll,
    validateAttributes,
} from "../utils";

const createSchema = joi.object({
    name: joi.string().regex(constants.namePattern).required(),
    directory: joi.boolean().required(),
    content: joi.string().default(""),
    app: joi.string().regex(constants.identifierPattern).required(),
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

// TODO: Allow description to be updated
const updateSchema = joi.object({
    id: joi.string().regex(constants.identifierPattern).required(),
    name: joi.string().regex(constants.namePattern),
    content: joi.string(),
});

const getByNameSchema = joi.object({
    app: joi.string().regex(constants.identifierPattern).required(),
    name: joi.string().regex(constants.namePattern).required(),
});

const toExternal = (sourceFile: ISourceFile): IExternalSourceFile => {
    const {
        _id,
        name,
        directory,
        creator,
        content,
        app,
        status,
        createdAt,
        updatedAt,
    } = sourceFile;

    /*
     * NOTE: At the moment, all the sourceFiles provide unpopulated fields.
     * Therefore, we consider all the IDs to be of type ObjectId.
     */
    return {
        id: _id.toString(),
        name,
        directory,
        creator: creator.toString(),
        content,
        app: app.toString(),
        status,
        createdAt,
        updatedAt,
    };
};

export const create = async (
    context: any,
    attributes: any,
): Promise<IExternalSourceFile> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const newSourceFile = await runAsTransaction(
        async (session: ClientSession) => {
            const newSourceFileId = new Types.ObjectId();
            const app = await AppModel.findOneAndUpdate(
                {
                    _id: value.app,
                    status: { $ne: "deleted" },
                },
                {
                    $push: {
                        sourceFiles: newSourceFileId,
                    },
                },
                {
                    lean: true,
                    new: true,
                    session,
                },
            );
            if (!app) {
                throw new NotFoundError(
                    `Cannot find an app with the specified identifier "${value.app}".`,
                );
            }

            /*
             * At this point, the app has been modified, regardless of the currently
             * user being authorized or not. When we check for access below, we rely
             * on the transaction failing to undo the changes.
             */
            checkAccessToApps(context.user, [app]);

            /* Check for the uniqueness of the source file name within the app. */
            const existingSourceFile = await SourceFileModel.findOne({
                name: value.name,
                app: value.app,
                status: { $ne: "deleted" },
            });
            if (existingSourceFile) {
                throw new BadRequestError(
                    `SourceFile with name "${value.name}" already exists.`,
                );
            }

            const newSourceFile = new SourceFileModel({
                ...value,
                _id: newSourceFileId,
                status: "created",
                creator: context.user._id,
            });
            await newSourceFile.save({ session });

            return newSourceFile;
        },
    );

    return toExternal(newSourceFile);
};

export const list = async (
    context: any,
    parameters: any,
): Promise<TSourceFilePage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { page, limit } = value;
    const app = await AppModel.findOne(
        {
            _id: value.app,
            status: { $ne: "deleted" },
        },
        null,
        { lean: true },
    ).exec();
    if (!app) {
        throw new NotFoundError(
            `Cannot find an app with the specified identifier "${value.app}".`,
        );
    }

    checkAccessToApps(context.user, [app]);

    const sourceFiles = await (SourceFileModel as any).paginate(
        {
            app: value.app,
            status: {
                $ne: "deleted",
            },
        },
        {
            limit,
            page: page + 1,
            lean: true,
            leanWithId: true,
            pagination: true,
            sort: {
                updatedAt: -1,
            },
        },
    );

    return {
        totalRecords: sourceFiles.totalDocs,
        totalPages: sourceFiles.totalPages,
        previousPage: sourceFiles.prevPage ? sourceFiles.prevPage - 1 : -1,
        nextPage: sourceFiles.nextPage ? sourceFiles.nextPage - 1 : -1,
        hasPreviousPage: sourceFiles.hasPrevPage,
        hasNextPage: sourceFiles.hasNextPage,
        records: sourceFiles.docs.map(toExternal),
    };
};

export const listByIds = async (
    context,
    sourceFileIds: string[],
): Promise<IExternalSourceFile[]> => {
    const sourceFiles = await SourceFileModel.find({
        _id: { $in: sourceFileIds },
        status: { $ne: "deleted" },
    }).exec();
    if (sourceFiles.length !== sourceFileIds.length) {
        throw new NotFoundError(
            `Could not find sourceFiles for every specified ID. Requested ${sourceFileIds.length} sourceFiles, but found ${sourceFiles.length} sourceFiles.`,
        );
    }

    checkAccessToSourceFiles(context.user, sourceFiles);

    const object = {};
    for (const sourceFile of sourceFiles) {
        object[sourceFile._id.toString()] = sourceFile;
    }

    return sourceFileIds.map((key) => toExternal(object[key]));
};

export const getById = async (
    context: any,
    id: string,
): Promise<IExternalSourceFile> => {
    if (!constants.identifierPattern.test(id)) {
        throw new BadRequestError(
            `The specified sourceFile identifier "${id}" is invalid.`,
        );
    }

    const sourceFile = await SourceFileModel.findOne(
        {
            _id: id,
            status: { $ne: "deleted" },
        },
        null,
        { lean: true },
    ).exec();

    /* We return a 404 error, if we did not find the entity. */
    if (!sourceFile) {
        throw new NotFoundError(
            `Cannot find a sourceFile with the specified identifier "${id}".`,
        );
    }

    checkAccessToSourceFiles(context.user, [sourceFile]);

    return toExternal(sourceFile);
};

export const getByName = async (
    context: any,
    attributes,
): Promise<IExternalSourceFile> => {
    const value = validateAttributes(getByNameSchema, attributes);

    const sourceFile = await SourceFileModel.findOne(
        {
            name: value.name,
            app: value.app,
            status: { $ne: "deleted" },
        },
        null,
        { lean: true },
    ).exec();

    /* We return a 404 error, if we did not find the entity. */
    if (!sourceFile) {
        throw new NotFoundError(
            `Cannot find a sourceFile with the specified name "${name}".`,
        );
    }

    checkAccessToSourceFiles(context.user, [sourceFile]);

    return toExternal(sourceFile);
};

export const update = async (context: any, id: string, attributes: any) => {
    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const updatedSourceFile = await runAsTransaction(
        async (session: ClientSession) => {
            const updatedSourceFile = await SourceFileModel.findOneAndUpdate(
                {
                    _id: id,
                    status: { $ne: "deleted" },
                },
                value,
                { new: true, lean: true, session },
            ).exec();

            if (!updatedSourceFile) {
                throw new NotFoundError(
                    `Cannot find an app with the specified identifier "${value.app}".`,
                );
            }

            /*
             * At this point, the sourceFile has been modified, regardless of the currently
             * user being authorized or not. When we check for access below, we rely
             * on the transaction failing to undo the changes.
             */
            checkAccessToSourceFiles(context.user, [updatedSourceFile]);

            return updatedSourceFile;
        },
    );

    return toExternal(updatedSourceFile);
};

export const remove = async (context: any, id: string) => {
    if (!constants.identifierPattern.test(id)) {
        throw new BadRequestError(
            `The specified sourceFile identifier "${id}" is invalid.`,
        );
    }

    await runAsTransaction(async (session: ClientSession) => {
        const sourceFile = await SourceFileModel.findOneAndUpdate(
            {
                _id: id,
                status: { $ne: "deleted" },
            },
            {
                status: "deleted",
            },
            {
                new: true,
                lean: true,
                session,
            },
        );
        if (!sourceFile) {
            throw new NotFoundError(
                `A sourceFile with the specified identifier "${id}" does not exist.`,
            );
        }

        /*
         * At this point, the sourceFile has been modified, regardless of the currently
         * user being authorized or not. When we check for access below, we rely
         * on the transaction failing to undo the changes.
         */
        checkAccessToSourceFiles(context.user, [sourceFile]);
    });

    return { success: true };
};
