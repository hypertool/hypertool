import { assert } from "chai";
import { beforeEach } from "mocha";

import { AppModel } from "../../source/models";
import { appData, assertThrowsAsync } from "../helper";

describe("App model", function () {
    let appTemplate = null;

    beforeEach(function () {
        appTemplate = appData;
    });

    afterEach(function () {
        appTemplate = null;
    });

    it("should be created with correct data", async () => {
        const newApp = new AppModel({ ...appTemplate });
        await newApp.save();
        assert.isFalse(
            newApp.isNew,
            "The log should be persisted to the database.",
        );
    });

    it("should not be created when name is undefined", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            name: undefined,
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The name attribute is required.",
        );
    });

    it("should not be created when name is null", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            name: null,
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The name attribute is required.",
        );
    });

    it("should not be created when name is empty", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            name: "",
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The name attribute is required.",
        );
    });

    it("should be created when name length is 1", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            name: "A",
        });
        await newApp.save();

        assert.lengthOf(
            newApp.name,
            1,
            "The name attribute should be of length 1.",
        );
    });

    it("should not be created when name is too long", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            name:
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        });
        await assertThrowsAsync(
            async () => newApp.save(),
            "The name attribute should have a maximum of 128 characters.",
        );
    });

    it("should not be created when title is undefined", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            title: undefined,
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The title attribute is required.",
        );
    });

    it("should not be created when title is null", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            title: null,
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The title attribute is required.",
        );
    });

    it("should not be created when title is empty", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            title: "",
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The title attribute is required.",
        );
    });

    it("should be created when title length is 1", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            title: "A",
        });
        await newApp.save();

        assert.lengthOf(
            newApp.title,
            1,
            "The title attribute should be of length 1.",
        );
    });

    it("should not be created when title is too long", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            title:
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        });
        await assertThrowsAsync(
            async () => newApp.save(),
            "The title attribute should have a maximum of 256 characters.",
        );
    });

    it("should not be created when slug is undefined", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            slug: undefined,
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The slug attribute is required.",
        );
    });

    it("should not be created when slug is null", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            slug: null,
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The slug attribute is required.",
        );
    });

    it("should not be created when slug is empty", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            slug: "",
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The slug attribute is required.",
        );
    });

    it("should be created when slug length is 1", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            slug: "A",
        });
        await newApp.save();

        assert.lengthOf(
            newApp.slug,
            1,
            "The slug attribute should be of length 1.",
        );
    });

    it("should not be created when slug is too long", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            slug:
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        });
        await assertThrowsAsync(
            async () => newApp.save(),
            "The slug attribute should have a maximum of 128 characters.",
        );
    });

    it("should be created when description is undefined", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            description: undefined,
        });

        await newApp.save();
        assert.isFalse(
            newApp.isNew,
            "The app should be persisted to the database.",
        );
    });

    it("should be created when description is null", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            description: null,
        });

        await newApp.save();
        assert.isFalse(
            newApp.isNew,
            "The app should be persisted to the database.",
        );
    });

    it("should be created when description length is 0", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            description: "",
        });
        await newApp.save();

        assert.lengthOf(
            newApp.description,
            0,
            "The description attribute should be of length 0.",
        );
    });

    it("should not be created when description is too long", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            description:
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAA",
        });
        await assertThrowsAsync(
            async () => newApp.save(),
            "The description attribute should have a maximum of 512 characters.",
        );
    });

    it("should be created when groups is undefined", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            groups: undefined,
        });

        await newApp.save();
        assert.isFalse(
            newApp.isNew,
            "The app should be persisted to the database.",
        );
    });

    it("should be created when groups is null", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            groups: null,
        });

        await newApp.save();
        assert.isFalse(
            newApp.isNew,
            "The app should be persisted to the database.",
        );
    });

    it("should be created when groups Array length is 0", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            groups: [],
        });
        await newApp.save();

        assert.lengthOf(
            newApp.groups,
            0,
            "The groups attribute should be of length 0.",
        );
    });

    it("should be created when resources is undefined", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            resources: undefined,
        });

        await newApp.save();
        assert.isFalse(
            newApp.isNew,
            "The app should be persisted to the database.",
        );
    });

    it("should be created when resources is null", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            resources: null,
        });

        await newApp.save();
        assert.isFalse(
            newApp.isNew,
            "The app should be persisted to the database.",
        );
    });

    it("should be created when resources Array length is 0", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            resources: [],
        });
        await newApp.save();

        assert.lengthOf(
            newApp.resources,
            0,
            "The resources attribute should be of length 0.",
        );
    });

    it("should be created when status is undefined", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            status: undefined,
        });

        await newApp.save();
        assert.isFalse(
            newApp.isNew,
            "The app should be persisted to the database.",
        );
    });

    it("should not be created when status is null", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            status: null,
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The status attribute is required.",
        );
    });

    it("should not be created when status is invalid", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            status: "no-api",
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The status attribute is not from defined origins.",
        );
    });

    it("should not be created when googleAuth enabled attribute is undefined", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            authServices: {
                googleAuth: {
                    enabled: undefined,
                    clidntId: "abcdefghijkl",
                    secret: "mnopqrstuvwxyz",
                },
            },
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The googleAuth enabled attribute is required.",
        );
    });

    it("should not be created when googleAuth enabled is null", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            authServices: {
                googleAuth: {
                    enabled: null,
                    clidntId: "abcdefghijkl",
                    secret: "mnopqrstuvwxyz",
                },
            },
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The googleAuth enabled attribute is required.",
        );
    });

    it("should not be created when googleAuth clientId attribute is undefined", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            authServices: {
                googleAuth: {
                    enabled: true,
                    clidntId: undefined,
                    secret: "mnopqrstuvwxyz",
                },
            },
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The googleAuth clientId attribute is required.",
        );
    });

    it("should not be created when googleAuth clientId is null", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            authServices: {
                googleAuth: {
                    enabled: true,
                    clidntId: null,
                    secret: "mnopqrstuvwxyz",
                },
            },
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The googleAuth clientId attribute is required.",
        );
    });

    it("should not be created when googleAuth secret attribute is undefined", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            authServices: {
                googleAuth: {
                    enabled: true,
                    clidntId: "abcdefghijkl",
                    secret: undefined,
                },
            },
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The googleAuth secret attribute is required.",
        );
    });

    it("should not be created when googleAuth secret is null", async () => {
        const newApp = new AppModel({
            ...appTemplate,
            authServices: {
                googleAuth: {
                    enabled: true,
                    clidntId: "abcdefghijkl",
                    secret: null,
                },
            },
        });

        await assertThrowsAsync(
            async () => newApp.save(),
            "The googleAuth secret attribute is required.",
        );
    });

    it("should be created with a default value for createdAt", async () => {
        const newApp = new AppModel({ ...appTemplate });
        await newApp.save();
        assert.typeOf(
            newApp.createdAt,
            "date",
            "The createdAt attribute should be assigned by default.",
        );
    });

    it("should be created with a default value for updatedAt", async () => {
        const newApp = new AppModel({ ...appTemplate });
        await newApp.save();
        assert.typeOf(
            newApp.updatedAt,
            "date",
            "The updatedAt attribute should be assigned by default.",
        );
    });
});
