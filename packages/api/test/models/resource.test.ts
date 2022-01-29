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
});
