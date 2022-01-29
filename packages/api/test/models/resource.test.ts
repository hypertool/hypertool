import { assert } from "chai";
import { assertThrowsAsync, resources } from "../helper";
import { ResourceModel } from "@hypertool/common";
import * as lodash from "lodash";

describe("Resource Model", function () {
    let resource = null;

    beforeEach(function () {
        [resource] = resources;
    });

    afterEach(function () {
        resource = null;
    });

    it("should be created with correct data", async () => {
        const newResource = new ResourceModel({ ...resource });
        await newResource.save();
        assert.isFalse(
            newResource.isNew,
            "The resource should be persisted to the database.",
        );
    });

    it("should be created when name is empty", async () => {
        const newResource = new ResourceModel({
            ...resource,
            name: "",
        });
        await newResource.save();

        assert.lengthOf(
            newResource.name,
            0,
            "The name attribute should be of length 0.",
        );
    });

    it("should not be created when name is too long", async () => {
        const newResource = new ResourceModel({
            ...resource,
            name: new Array(257 + 1).join("a"),
        });
        await assertThrowsAsync(
            async () => newResource.save(),
            "The name attribute should have a maximum of 256 characters.",
        );
    });

    it("should not be created when name is undefined", async () => {
        const newResource = new ResourceModel({
            ...resource,
            name: undefined,
        });

        await assertThrowsAsync(
            async () => newResource.save(),
            "The name attribute is required.",
        );
    });

    it("should not be created when name is null", async () => {
        const newResource = new ResourceModel({
            ...resource,
            name: null,
        });

        await assertThrowsAsync(
            async () => newResource.save(),
            "The name attribute is required.",
        );
    });

    it("should be created when description is empty", async () => {
        const newResource = new ResourceModel({
            ...resource,
            description: "",
        });
        await newResource.save();

        assert.lengthOf(
            newResource.description,
            0,
            "The description attribute should be of length 0.",
        );
    });

    it("should not be created when description is too long", async () => {
        const newResource = new ResourceModel({
            ...resource,
            description: new Array(513 + 1).join("a"),
        });
        await assertThrowsAsync(
            async () => newResource.save(),
            "The description attribute should have a maximum of 512 characters.",
        );
    });

    it("should be created when description is undefined", async () => {
        const newResource = new ResourceModel({
            ...resource,
            description: undefined,
        });

        await newResource.save();
        assert.isFalse(
            newResource.isNew,
            "The resource should be persisted to the database.",
        );
    });

    it("should be created when description is null", async () => {
        const newResource = new ResourceModel({
            ...resource,
            description: null,
        });

        await newResource.save();
        assert.isFalse(
            newResource.isNew,
            "The resource should be persisted to the database.",
        );
    });

    it("should be created when creator is null", async () => {
        const newResource = new ResourceModel({
            ...resource,
            creator: null,
        });

        await newResource.save();
        assert.isFalse(
            newResource.isNew,
            "The resource should be persisted to the database.",
        );
    });

    it("should be created when creator is undefined", async () => {
        const newResource = new ResourceModel({
            ...resource,
            creator: undefined,
        });

        await newResource.save();
        assert.isFalse(
            newResource.isNew,
            "The resource should be persisted to the database.",
        );
    });

    it("should not be created when type is invalid", async () => {
        const newResource = new ResourceModel({
            ...resource,
            type: "lorem",
        });

        await assertThrowsAsync(
            async () => newResource.save(),
            "The type attribute is not from defined options.",
        );
    });

    it("should not be created when type is undefined", async () => {
        const newResource = new ResourceModel({
            ...resource,
            type: undefined,
        });

        await assertThrowsAsync(
            async () => newResource.save(),
            "The type attribute is required.",
        );
    });

    it("should not be created when type is null", async () => {
        const newResource = new ResourceModel({
            ...resource,
            type: null,
        });

        await assertThrowsAsync(
            async () => newResource.save(),
            "The type attribute is required.",
        );
    });

    it("should not be created when status is invalid", async () => {
        const newResource = new ResourceModel({
            ...resource,
            status: "lorem",
        });

        await assertThrowsAsync(
            async () => newResource.save(),
            "The status attribute is not from defined options.",
        );
    });

    it("should be created when status is null", async () => {
        const newResource = new ResourceModel({
            ...resource,
            status: null,
        });

        await newResource.save();
        assert.isFalse(
            newResource.isNew,
            "The resource should be persisted to the database.",
        );
    });

    it("should be created when status is undefined", async () => {
        const newResource = new ResourceModel({
            ...resource,
            status: undefined,
        });
        await newResource.save();
        assert.isFalse(
            newResource.isNew,
            "The resource should be persisted to the database.",
        );
    });

    it("should not be created when mysql.host is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.mysql.host = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.host attribute is required.",
        );
    });

    it("should not be created when mysql.port is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.mysql.port = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.port attribute is required.",
        );
    });

    it("should not be created when mysql.databaseName is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.mysql.databaseName = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.databaseName attribute is required.",
        );
    });

    it("should not be created when mysql.databaseUserName is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.mysql.databaseUserName = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.databaseUserName attribute is required.",
        );
    });

    it("should not be created when mysql.databasePassword is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.mysql.databasePassword = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.databasePassword attribute is required.",
        );
    });

    it("should not be created when mysql.connectUsingSSL is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.mysql.connectUsingSSL = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.connectUsingSSL attribute is required.",
        );
    });

    it("should not be created when mysql.host is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.mysql.host = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.host attribute is required.",
        );
    });

    it("should not be created when mysql.port is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.mysql.port = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.port attribute is required.",
        );
    });

    it("should not be created when mysql.databaseName is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.mysql.databaseName = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.databaseName attribute is required.",
        );
    });

    it("should not be created when mysql.databaseUserName is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.mysql.databaseUserName = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.databaseUserName attribute is required.",
        );
    });

    it("should not be created when mysql.databasePassword is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.mysql.databasePassword = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.databasePassword attribute is required.",
        );
    });

    it("should not be created when mysql.connectUsingSSL is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.mysql.connectUsingSSL = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.connectUsingSSL attribute is required.",
        );
    });
});
