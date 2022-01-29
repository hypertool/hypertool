import { assert } from "chai";
import { assertThrowsAsync, resources } from "../helper";
import { ResourceModel } from "@hypertool/common";

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
});
