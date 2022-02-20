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
    user: joi.string().regex(constants.identifierPattern),
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
