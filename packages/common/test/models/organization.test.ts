import { assert } from "chai";

import { OrganizationModel } from "../../source/models";
import { assertThrowsAsync, organizations } from "../helper";

describe("Organization model", function () {
    let organization = null;

    beforeEach(function () {
        [organization] = organizations;
    });

    afterEach(function () {
        organization = null;
    });

    it("should be created with correct data", async () => {
        const newOrganization = new OrganizationModel({ ...organization });
        await newOrganization.save();
        assert.isFalse(
            newOrganization.isNew,
            "The log should be persisted to the database.",
        );
    });

    it("should not be created when name is undefined", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            name: undefined,
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The name attribute is required.",
        );
    });

    it("should not be created when name is null", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            name: null,
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The name attribute is required.",
        );
    });

    it("should not be created when name is empty", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            name: "",
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The name attribute is required.",
        );
    });

    it("should be created when name length is 1", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            name: "A",
        });
        await newOrganization.save();

        assert.lengthOf(
            newOrganization.name,
            1,
            "The name attribute should be of length 1.",
        );
    });

    it("should not be created when name is too long", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            name: new Array(257 + 1).join("A"),
        });
        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The name attribute should have a maximum of 256 characters.",
        );
    });
});
