import * as lodash from "lodash";
import { assert } from "chai";

import { CommentModel } from "../../source/models";
import { assertThrowsAsync, comments } from "../helper";

describe("Comment model", function () {
    let comment = null;

    beforeEach(function () {
        [comment] = comments;
    });

    afterEach(function () {
        comment = null;
    });

    it("should be created with correct data", async () => {
        const newComment = new CommentModel({ ...comment });
        await newComment.save();
        assert.isFalse(
            newComment.isNew,
            "The comment should be persisted to the database.",
        );
    });

    it("should not be created when author in comment is undefined", async () => {
        const newComment = new CommentModel({ comment, author: undefined });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The author in comment attribute is required.",
        );
    });

    it("should not be created when author in comment is null", async () => {
        const newComment = new CommentModel({ comment, author: null });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The author in comment attribute is required.",
        );
    });

    it("should not be created when content in comment is undefined", async () => {
        const newComment = new CommentModel({ comment, content: undefined });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The content in comment attribute is required.",
        );
    });

    it("should not be created when content in comment is null", async () => {
        const newComment = new CommentModel({ comment, content: null });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The content in comment attribute is required.",
        );
    });

    it("should not be created when content in comment is empty", async () => {
        const newComment = new CommentModel({ comment, content: "" });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The content in comment attribute should have at least 1 character.",
        );
    });

    it("should not be created when content in comment is too long", async () => {
        const newComment = new CommentModel({
            comment,
            content: new Array(513 + 1).join("a"),
        });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The content in comment attribute should have a maximum of 512 characters.",
        );
    });

    it("should not be created when status is invalid", async () => {
        const newComment = new CommentModel({
            ...comment,
            status: "lorem",
        });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The status attribute is not from defined options.",
        );
    });

    it("should not be created when status is null", async () => {
        const newComment = new CommentModel({
            ...comment,
            status: null,
        });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The status attribute is required.",
        );
    });

    it("should not be created when status is undefined", async () => {
        const newComment = new CommentModel({
            ...comment,
            status: undefined,
        });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The status attribute is required.",
        );
    });

    it("should not be created when conversation in comment is undefined", async () => {
        const newComment = new CommentModel({
            comment,
            conversation: undefined,
        });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The conversation in comment attribute is required.",
        );
    });

    it("should not be created when conversation in comment is null", async () => {
        const newComment = new CommentModel({ comment, conversation: null });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The conversation in comment attribute is required.",
        );
    });

    it("should not be created when edited in comment is undefined", async () => {
        const newComment = new CommentModel({
            comment,
            edited: undefined,
        });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The edited in comment attribute is required.",
        );
    });

    it("should not be created when edited in comment is null", async () => {
        const newComment = new CommentModel({ comment, edited: null });

        await assertThrowsAsync(
            async () => newComment.save(),
            "The edited in comment attribute is required.",
        );
    });
});
