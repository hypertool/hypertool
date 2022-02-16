import { assert } from "chai";

import { PageModel } from "../../source/models";
import { assertThrowsAsync, pages } from "../helper";

describe("Page model", function () {
    let page = null;

    beforeEach(function () {
        [page] = pages;
    });

    afterEach(function () {
        page = null;
    });

    it("should be created with correct data", async () => {
        const newPage = new PageModel({ ...page });
        await newPage.save();
        assert.isFalse(
            newPage.isNew,
            "The page should be persisted to the database.",
        );
    });

    it("should not be created when app is undefined", async () => {
        const newPage = new PageModel({
            ...page,
            app: undefined,
        });

        await assertThrowsAsync(
            async () => newPage.save(),
            "The app attribute is required.",
        );
    });

    it("should not be created when app is null", async () => {
        const newPage = new PageModel({
            ...page,
            app: null,
        });

        await assertThrowsAsync(
            async () => newPage.save(),
            "The app attribute is required.",
        );
    });

    it("should be created with a default value for createdAt", async () => {
        const newPage = new PageModel({ ...page });
        await newPage.save();
        assert.typeOf(
            newPage.createdAt,
            "date",
            "The createdAt attribute should be assigned by default.",
        );
    });

    it("should be created with a default value for updatedAt", async () => {
        const newPage = new PageModel({ ...page });
        await newPage.save();
        assert.typeOf(
            newPage.updatedAt,
            "date",
            "The updatedAt attribute should be assigned by default.",
        );
    });

    it("should not be created when title is undefined", async () => {
        const newPage = new PageModel({
            ...page,
            title: undefined,
        });

        await assertThrowsAsync(
            async () => newPage.save(),
            "The title attribute is required.",
        );
    });

    it("should not be created when title is null", async () => {
        const newPage = new PageModel({
            ...page,
            title: null,
        });

        await assertThrowsAsync(
            async () => newPage.save(),
            "The title attribute is required.",
        );
    });

    it("should not be created when title is empty", async () => {
        const newPage = new PageModel({
            ...page,
            title: "",
        });

        await assertThrowsAsync(
            async () => newPage.save(),
            "The title attribute is required.",
        );
    });

    it("should be created when title length is 1", async () => {
        const newPage = new PageModel({
            ...page,
            title: "A",
        });
        await newPage.save();

        assert.lengthOf(
            newPage.title,
            1,
            "The title attribute should be of length 1.",
        );
    });

    it("should not be created when title is too long", async () => {
        const newPage = new PageModel({
            ...page,
            title: new Array(129 + 1).join("A"),
        });
        await assertThrowsAsync(
            async () => newPage.save(),
            "The title attribute should have a maximum of 129 characters.",
        );
    });

    it("should be created when description is undefined", async () => {
        const newPage = new PageModel({
            ...page,
            description: undefined,
        });

        await newPage.save();
        assert.isFalse(
            newPage.isNew,
            "The page should be persisted to the database.",
        );
    });

    it("should be created when description is null", async () => {
        const newPage = new PageModel({
            ...page,
            description: null,
        });

        await newPage.save();
        assert.isFalse(
            newPage.isNew,
            "The page should be persisted to the database.",
        );
    });

    it("should not be created when description is empty", async () => {
        const newPage = new PageModel({
            ...page,
            description: "",
        });

        await assertThrowsAsync(
            async () => newPage.save(),
            "The description attribute is required.",
        );
    });

    it("should be created when description length is 1", async () => {
        const newPage = new PageModel({
            ...page,
            description: "A",
        });
        await newPage.save();

        assert.lengthOf(
            newPage.description,
            1,
            "The description attribute should be of length 1.",
        );
    });

    it("should not be created when description is too long", async () => {
        const newPage = new PageModel({
            ...page,
            description: new Array(513 + 1).join("A"),
        });
        await assertThrowsAsync(
            async () => newPage.save(),
            "The description attribute should have a maximum of 129 characters.",
        );
    });

    it("should not be created when slug is undefined", async () => {
        const newPage = new PageModel({
            ...page,
            slug: undefined,
        });

        await assertThrowsAsync(
            async () => newPage.save(),
            "The slug attribute is required.",
        );
    });

    it("should not be created when slug is null", async () => {
        const newPage = new PageModel({
            ...page,
            slug: null,
        });

        await assertThrowsAsync(
            async () => newPage.save(),
            "The slug attribute is required.",
        );
    });

    it("should not be created when slug is empty", async () => {
        const newPage = new PageModel({
            ...page,
            slug: "",
        });

        await assertThrowsAsync(
            async () => newPage.save(),
            "The slug attribute is required.",
        );
    });

    it("should be created when slug length is 1", async () => {
        const newPage = new PageModel({
            ...page,
            slug: "A",
        });
        await newPage.save();

        assert.lengthOf(
            newPage.slug,
            1,
            "The slug attribute should be of length 1.",
        );
    });

    it("should not be created when slug is too long", async () => {
        const newPage = new PageModel({
            ...page,
            slug: new Array(129 + 1).join("A"),
        });
        await assertThrowsAsync(
            async () => newPage.save(),
            "The slug attribute should have a maximum of 129 characters.",
        );
    });
});
