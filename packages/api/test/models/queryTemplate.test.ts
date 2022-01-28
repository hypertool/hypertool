import { beforeEach } from "mocha";
import { QueryTemplateModel } from "@hypertool/common";
import { assert } from "chai";
import { assertThrowsAsync, queryTemplates } from "../helper";

describe("QueryTemplate Model", function () {
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
            name:
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAA",
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
});
