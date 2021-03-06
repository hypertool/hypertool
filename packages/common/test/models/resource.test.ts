import * as lodash from "lodash";
import { assert } from "chai";

import { ResourceModel } from "../../source/models";
import { assertThrowsAsync, resources } from "../helper";

describe("Resource model", function () {
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

    it("should not be created when name is empty", async () => {
        const newResource = new ResourceModel({
            ...resource,
            name: "",
        });

        await assertThrowsAsync(
            async () => await newResource.save(),
            "The name attribute should have at least 1 character.",
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

        await assertThrowsAsync(
            async () => newResource.save(),
            "The status attribute is required.",
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
        newResource.postgres = resource.mysql;
        newResource.mysql.host = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.host attribute is required.",
        );
    });

    it("should not be created when mysql.port is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.mysql.port = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.port attribute is required.",
        );
    });

    it("should not be created when mysql.databaseName is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.mysql.databaseName = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.databaseName attribute is required.",
        );
    });

    it("should not be created when mysql.databaseUserName is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.mysql.databaseUserName = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.databaseUserName attribute is required.",
        );
    });

    it("should not be created when mysql.databasePassword is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.mysql.databasePassword = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.databasePassword attribute is required.",
        );
    });

    it("should not be created when mysql.connectUsingSSL is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.mysql.connectUsingSSL = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.connectUsingSSL attribute is required.",
        );
    });

    it("should not be created when mysql.host is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.mysql.host = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.host attribute is required.",
        );
    });

    it("should not be created when mysql.port is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.mysql.port = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.port attribute is required.",
        );
    });

    it("should not be created when mysql.databaseName is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.mysql.databaseName = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.databaseName attribute is required.",
        );
    });

    it("should not be created when mysql.databaseUserName is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.mysql.databaseUserName = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.databaseUserName attribute is required.",
        );
    });

    it("should not be created when mysql.databasePassword is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.mysql.databasePassword = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.databasePassword attribute is required.",
        );
    });

    it("should not be created when mysql.connectUsingSSL is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.mysql.connectUsingSSL = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mysql.connectUsingSSL attribute is required.",
        );
    });

    it("should not be created when postgres.host is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.postgres.host = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The postgres.host attribute is required.",
        );
    });

    it("should not be created when postgres.port is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.postgres.port = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The postgres.port attribute is required.",
        );
    });

    it("should not be created when postgres.databaseName is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.postgres.databaseName = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The postgres.databaseName attribute is required.",
        );
    });

    it("should not be created when postgres.databaseUserName is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.postgres.databaseUserName = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The postgres.databaseUserName attribute is required.",
        );
    });

    it("should not be created when postgres.databasePassword is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.postgres.databasePassword = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The postgres.databasePassword attribute is required.",
        );
    });

    it("should not be created when postgres.connectUsingSSL is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.postgres.connectUsingSSL = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The postgres.connectUsingSSL attribute is required.",
        );
    });

    it("should not be created when postgres.host is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.postgres.host = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The postgres.host attribute is required.",
        );
    });

    it("should not be created when postgres.port is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.postgres.port = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The postgres.port attribute is required.",
        );
    });

    it("should not be created when postgres.databaseName is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.postgres.databaseName = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The postgres.databaseName attribute is required.",
        );
    });

    it("should not be created when postgres.databaseUserName is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.postgres.databaseUserName = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The postgres.databaseUserName attribute is required.",
        );
    });

    it("should not be created when postgres.databasePassword is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.postgres.databasePassword = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The postgres.databasePassword attribute is required.",
        );
    });

    it("should not be created when postgres.connectUsingSSL is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.postgres = resource.mysql;
        newResource.postgres.connectUsingSSL = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The postgres.connectUsingSSL attribute is required.",
        );
    });

    it("should not be created when mongodb.host is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.mongodb = resource.mysql;
        newResource.mongodb.host = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mongodb.host attribute is required.",
        );
    });

    it("should not be created when mongodb.port is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.mongodb = resource.mysql;
        newResource.mongodb.port = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mongodb.port attribute is required.",
        );
    });

    it("should not be created when mongodb.databaseName is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.mongodb = resource.mysql;
        newResource.mongodb.databaseName = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mongodb.databaseName attribute is required.",
        );
    });

    it("should not be created when mongodb.databaseUserName is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.mongodb = resource.mysql;
        newResource.mongodb.databaseUserName = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mongodb.databaseUserName attribute is required.",
        );
    });

    it("should not be created when mongodb.databasePassword is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.mongodb = resource.mysql;
        newResource.mongodb.databasePassword = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mongodb.databasePassword attribute is required.",
        );
    });

    it("should not be created when mongodb.connectUsingSSL is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.mongodb = resource.mysql;
        newResource.mongodb.connectUsingSSL = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mongodb.connectUsingSSL attribute is required.",
        );
    });

    it("should not be created when mongodb.host is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.mongodb = resource.mysql;
        newResource.mongodb.host = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mongodb.host attribute is required.",
        );
    });

    it("should not be created when mongodb.port is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.mongodb = resource.mysql;
        newResource.mongodb.port = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mongodb.port attribute is required.",
        );
    });

    it("should not be created when mongodb.databaseName is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.mongodb = resource.mysql;
        newResource.mongodb.databaseName = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mongodb.databaseName attribute is required.",
        );
    });

    it("should not be created when mongodb.databaseUserName is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.mongodb = resource.mysql;
        newResource.mongodb.databaseUserName = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mongodb.databaseUserName attribute is required.",
        );
    });

    it("should not be created when mongodb.databasePassword is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.mongodb = resource.mysql;
        newResource.mongodb.databasePassword = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mongodb.databasePassword attribute is required.",
        );
    });

    it("should not be created when mongodb.connectUsingSSL is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.mongodb = resource.mysql;
        newResource.mongodb.connectUsingSSL = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The mongodb.connectUsingSSL attribute is required.",
        );
    });

    it("should not be created when bigquery.key is undefined", async () => {
        const newResource = lodash.clone(resource);
        newResource.bigquery = undefined;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The bigquery.key attribute is required.",
        );
    });

    it("should not be created when bigquery.key is null", async () => {
        const newResource = lodash.clone(resource);
        newResource.bigquery = null;

        await assertThrowsAsync(
            async () => newResource.save(),
            "The bigquery.key attribute is required.",
        );
    });

    it("should not be created when bigquery.key is empty", async () => {
        const newResource = lodash.clone(resource);
        newResource.bigquery = {};

        await assertThrowsAsync(
            async () => newResource.save(),
            "The bigquery.key attribute is required.",
        );
    });
});
