import { assert } from "chai";
import * as lodash from "lodash";

import { assertThrowsAsync, conversations } from "../helper";
import { ConversationModel } from "../../source/models";

describe("Conversation model", function () {
    let conversation = null;

    beforeEach(function () {
        [conversation] = conversations;
    });

    afterEach(function () {
        conversation = null;
    });

    it("should be created with correct data", async () => {
        const newConversation = new ConversationModel({ ...conversation });
        await newConversation.save();
        assert.isFalse(
            newConversation.isNew,
            "The conversation should be persisted to the database.",
        );
    });

    it("should not be created when app is undefined", async () => {
        const newConversation = new ConversationModel({
            ...conversation,
            app: undefined,
        });

        await assertThrowsAsync(
            async () => newConversation.save(),
            "The app attribute is required.",
        );
    });

    it("should not be created when app is null", async () => {
        const newConversation = new ConversationModel({
            ...conversation,
            app: null,
        });

        await assertThrowsAsync(
            async () => newConversation.save(),
            "The app attribute is required.",
        );
    });

    it("should not be created when page is empty", async () => {
        const newConversation = new ConversationModel({
            ...conversation,
            page: "",
        });

        await assertThrowsAsync(
            async () => await newConversation.save(),
            "The page attribute should have at least 1 character.",
        );
    });

    it("should not be created when page is too long", async () => {
        const newConversation = new ConversationModel({
            ...conversation,
            page: new Array(129 + 1).join("a"),
        });
        await assertThrowsAsync(
            async () => newConversation.save(),
            "The page attribute should have a maximum of 128 characters.",
        );
    });

    it("should not be created when page is undefined", async () => {
        const newConversation = new ConversationModel({
            ...conversation,
            page: undefined,
        });

        await assertThrowsAsync(
            async () => newConversation.save(),
            "The page attribute is required.",
        );
    });

    it("should not be created when page is null", async () => {
        const newConversation = new ConversationModel({
            ...conversation,
            page: null,
        });

        await assertThrowsAsync(
            async () => newConversation.save(),
            "The page attribute is required.",
        );
    });

    it("should be created with a default value for createdAt", async () => {
        const newConversation = new ConversationModel({ ...conversation });
        await newConversation.save();
        assert.typeOf(
            newConversation.createdAt,
            "date",
            "The createdAt attribute should be assigned by default.",
        );
    });

    it("should be created with a default value for updatedAt", async () => {
        const newConversation = new ConversationModel({ ...conversation });
        await newConversation.save();
        assert.typeOf(
            newConversation.updatedAt,
            "date",
            "The updatedAt attribute should be assigned by default.",
        );
    });

    it("should not be created when coordinates is undefined", async () => {
        const newConversation = new ConversationModel({
            ...conversation,
            coordinates: undefined,
        });

        await assertThrowsAsync(
            async () => newConversation.save(),
            "The coordinates attribute is required.",
        );
    });

    it("should not be created when coordinates is null", async () => {
        const newConversation = new ConversationModel({
            ...conversation,
            coordinates: null,
        });

        await assertThrowsAsync(
            async () => newConversation.save(),
            "The coordinates attribute is required.",
        );
    });

    it("should not be created when coordinates.x is undefined", async () => {
        const newConversation = lodash.clone(conversation);
        newConversation.coordinates = conversation.coordinates;
        newConversation.coordinates.x = undefined;

        await assertThrowsAsync(
            async () => newConversation.save(),
            "The coordinates.x attribute is required.",
        );
    });

    it("should not be created when coordinates.x is null", async () => {
        const newConversation = lodash.clone(conversation);
        newConversation.coordinates = conversation.coordinates;
        newConversation.coordinates.x = null;

        await assertThrowsAsync(
            async () => newConversation.save(),
            "The coordinates.x attribute is required.",
        );
    });

    it("should not be created when coordinates.y is undefined", async () => {
        const newConversation = lodash.clone(conversation);
        newConversation.coordinates = conversation.coordinates;
        newConversation.coordinates.y = undefined;

        await assertThrowsAsync(
            async () => newConversation.save(),
            "The coordinates.y attribute is required.",
        );
    });

    it("should not be created when coordinates.y is null", async () => {
        const newConversation = lodash.clone(conversation);
        newConversation.coordinates = conversation.coordinates;
        newConversation.coordinates.y = null;

        await assertThrowsAsync(
            async () => newConversation.save(),
            "The coordinates.y attribute is required.",
        );
    });
});
