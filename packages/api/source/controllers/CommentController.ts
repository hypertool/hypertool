import type { Comment, CommentPage, ExternalComment } from "@hypertool/common";
import {
    BadRequestError,
    CommentModel,
    ConversationModel,
    NotFoundError,
    UnauthorizedError,
    constants,
} from "@hypertool/common";
import joi from "joi";

const createSchema = joi.object({
    author: joi.string().regex(constants.identifierPattern),
    content: joi.string().max(512).min(1).required(),
    conversation: joi.string().regex(constants.identifierPattern),
});

const updateSchema = joi.object({
    content: joi.string().max(512).min(1).required(),
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

const toExternal = (comment: any): ExternalComment => {
    const {
        _id,
        id,
        author,
        edited,
        status,
        content,
        conversation,
        createdAt,
        updatedAt,
    } = comment;
    return {
        id: id || _id.toString(),
        author,
        edited,
        status,
        content,
        conversation,
        createdAt,
        updatedAt,
    };
};
