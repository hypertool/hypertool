import { beforeEach } from "mocha";
import { assert } from "chai";

import { QueryTemplateModel } from "../../source/models";
import { assertThrowsAsync, queryTemplates } from "../helper";

describe("QueryTemplate model", function () {
    let queryTemplate = null;

    beforeEach(function () {
        [queryTemplate] = queryTemplates;
    });

    afterEach(function () {
        queryTemplate = null;
    });

    it("should be created with correct data", async () => {
        const newQuery = new QueryTemplateModel({ ...queryTemplate });
        await newQuery.save();
        assert.isFalse(
            newQuery.isNew,
            "The query should be persisted to the database.",
        );
    });

    it("should be created when name length is 1", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            name: "A",
        });
        await newQuery.save();

        assert.lengthOf(
            newQuery.name,
            1,
            "The name attribute should be of length 1.",
        );
    });

    it("should not be created when name is too long", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            name: new Array(129 + 1).join("a"),
        });
        await assertThrowsAsync(
            async () => newQuery.save(),
            "The name attribute should have a maximum of 128 characters.",
        );
    });

    it("should not be created when name is undefined", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            name: undefined,
        });

        await assertThrowsAsync(
            async () => newQuery.save(),
            "The name attribute is required.",
        );
    });

    it("should not be created when name is null", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            name: null,
        });

        await assertThrowsAsync(
            async () => newQuery.save(),
            "The name attribute is required.",
        );
    });

    it("should not be created when name is empty", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            name: "",
        });

        await assertThrowsAsync(
            async () => newQuery.save(),
            "The name attribute is required.",
        );
    });

    it("should not be created when description is too long", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            description: new Array(1026).join("a"),
        });
        await assertThrowsAsync(
            async () => newQuery.save(),
            "The description attribute should have a maximum of 128 characters.",
        );
    });

    it("should be created when description is undefined", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            description: undefined,
        });

        await newQuery.save();
        assert.isFalse(
            newQuery.isNew,
            "The query should be persisted to the database.",
        );
    });

    it("should be created when description is null", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            description: null,
        });

        await newQuery.save();
        assert.isFalse(
            newQuery.isNew,
            "The query should be persisted to the database.",
        );
    });

    it("should be created when description is empty", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            description: "",
        });

        await newQuery.save();

        assert.lengthOf(
            newQuery.description,
            0,
            "The name attribute should be of length 0.",
        );
    });

    it("should be created when resource is undefined", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            resource: undefined,
        });

        await newQuery.save();
        assert.isFalse(
            newQuery.isNew,
            "The query should be persisted to the database.",
        );
    });

    it("should be created when resource is null", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            resource: null,
        });

        await newQuery.save();
        assert.isFalse(
            newQuery.isNew,
            "The query should be persisted to the database.",
        );
    });

    it("should be created when app is undefined", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            app: undefined,
        });

        await newQuery.save();
        assert.isFalse(
            newQuery.isNew,
            "The query should be persisted to the database.",
        );
    });

    it("should be created when app is null", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            app: null,
        });

        await newQuery.save();
        assert.isFalse(
            newQuery.isNew,
            "The query should be persisted to the database.",
        );
    });

    it("should be created when content length is 1", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            content: "A",
        });
        await newQuery.save();

        assert.lengthOf(
            newQuery.content,
            1,
            "The content attribute should be of length 1.",
        );
    });

    it("should not be created when content is too long", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            content: new Array(10241 + 1).join("a"),
        });
        await assertThrowsAsync(
            async () => newQuery.save(),
            "The content attribute should have a maximum of 128 characters.",
        );
    });

    it("should not be created when content is undefined", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            content: undefined,
        });

        await assertThrowsAsync(
            async () => newQuery.save(),
            "The content attribute is required.",
        );
    });

    it("should not be created when content is null", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            content: null,
        });

        await assertThrowsAsync(
            async () => newQuery.save(),
            "The content attribute is required.",
        );
    });

    it("should not be created when content is empty", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            content: "",
        });

        await assertThrowsAsync(
            async () => newQuery.save(),
            "The content attribute is required.",
        );
    });

    it("should be created with a default value for createdAt", async () => {
        const newLog = new QueryTemplateModel({ ...queryTemplate });
        await newLog.save();
        assert.typeOf(
            newLog.createdAt,
            "date",
            "The createdAt attribute should be assigned by default.",
        );
    });

    it("should be created with a default value for updatedAt", async () => {
        const newLog = new QueryTemplateModel({ ...queryTemplate });
        await newLog.save();
        assert.typeOf(
            newLog.updatedAt,
            "date",
            "The updatedAt attribute should be assigned by default.",
        );
    });

    it("should not be created when status is invalid", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            status: "lorem",
        });

        await assertThrowsAsync(
            async () => newQuery.save(),
            "The status attribute is not from defined origins.",
        );
    });

    it("should not be created when status is null", async () => {
        const newQuery = new QueryTemplateModel({
            ...queryTemplate,
            status: null,
        });

        await assertThrowsAsync(
            async () => newQuery.save(),
            "The status attribute is required.",
        );
    });
});
