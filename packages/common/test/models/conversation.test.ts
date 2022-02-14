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
});
