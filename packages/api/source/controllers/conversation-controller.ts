import type {
    Conversation,
    ConversationPage,
    ExternalConversation,
} from "@hypertool/common";
import {
    BadRequestError,
    CommentModel,
    ConversationModel,
    NotFoundError,
    constants,
} from "@hypertool/common";
import joi from "joi";
import mongoose from "mongoose";

const createSchema = joi.object({
    app: joi.string().regex(constants.identifierPattern).required(),
    page: joi.string().regex(constants.identifierPattern).required(),
    coordinates: joi
        .object({
            x: joi.number().required(),
            y: joi.number().required(),
        })
        .required(),
    comment: joi.string().max(512).min(1).required(),
    user: joi.string().regex(constants.identifierPattern).required(),
});

const updateSchema = joi.object({
    coordinates: joi
        .object({
            x: joi.number().required(),
            y: joi.number().required(),
        })
        .required(),
});

const filterSchema = joi.object({
    page: joi.number().integer().default(0),
    limit: joi
        .number()
        .integer()
        .min(constants.paginateMinLimit)
        .max(constants.paginateMaxLimit)
        .default(constants.paginateMinLimit),
});

const toExternal = (comment: any): ExternalConversation => {
    const {
        _id,
        id,
        app,
        page,
        coordinates,
        taggedUsers,
        comments,
        status,
        createdAt,
        updatedAt,
    } = comment;
    return {
        id: _id.toString() || id,
        app,
        page,
        coordinates,
        taggedUsers,
        comments,
        status,
        createdAt,
        updatedAt,
    };
};

const create = async (context, attributes): Promise<ExternalConversation> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const { app, page, coordinates, user, comment } = value;

    const conversationId = new mongoose.Types.ObjectId();

    const newComment = new CommentModel({
        author: user,
        content: comment,
        conversation: conversationId,
        edited: false,
        status: "created",
    });
    await newComment.save();

    const newConversation = new ConversationModel({
        _id: conversationId,
        app,
        page,
        coordinates,
        taggedUsers: [user],
        comments: [newComment],
        status: "pending",
    });

    await newConversation.save();

    return toExternal(newConversation);
};

const update = async (
    context,
    conversationId: string,
    attributes,
): Promise<ExternalConversation> => {
    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const conversation = await ConversationModel.findByIdAndUpdate(
        conversationId,
        {
            ...value,
        },
        { new: true },
    );

    if (!conversation) {
        throw new NotFoundError(
            "A conversation with the specified identifier does not exist.",
        );
    }

    return toExternal(conversation);
};

const list = async (context, parameters): Promise<ConversationPage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    const filters = {
        status: {
            $ne: "deleted",
        },
    };
    const { page, limit } = value;

    const conversations = await (ConversationModel as any).paginate(filters, {
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
        totalRecords: conversations.totalDocs,
        totalPages: conversations.totalPages,
        previousPage: conversations.prevPage ? conversations.prevPage - 1 : -1,
        nextPage: conversations.nextPage ? conversations.nextPage - 1 : -1,
        hasPreviousPage: conversations.hasPrevPage,
        hasNextPage: conversations.hasNextPage,
        records: conversations.docs.map(toExternal),
    };
};

const listById = async (
    context,
    conversationIds: string[],
): Promise<ExternalConversation[]> => {
    const unorderedConversations = await ConversationModel.find({
        _id: { $in: conversationIds },
        status: { $ne: "deleted" },
    }).exec();
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const conversation of unorderedConversations) {
        object[conversation._id.toString()] = conversation;
    }
    // eslint-disable-next-line security/detect-object-injection
    const res = conversationIds.map((key) => toExternal(object[key]));
    console.log(res);
    return res;
};

const changeStatus = async (
    context,
    conversationId: string,
    status: string,
    notEqual: string[],
): Promise<{ success: boolean }> => {
    if (!constants.identifierPattern.test(conversationId)) {
        throw new BadRequestError(
            "The specified conversation identifier is invalid.",
        );
    }

    const updatedConversation = await ConversationModel.findByIdAndUpdate(
        {
            _id: conversationId,
            status: { $ne: notEqual },
        },
        {
            status,
        },
        {
            new: true,
            lean: true,
        },
    );

    if (!updatedConversation) {
        throw new NotFoundError(
            "An comment with the specified identifier does not exist.",
        );
    }

    return { success: true };
};

export { create, update, list, listById, changeStatus };
