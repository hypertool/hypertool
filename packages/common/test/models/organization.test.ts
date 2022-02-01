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

    it("should not be created when title is undefined", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            title: undefined,
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The title attribute is required.",
        );
    });

    it("should not be created when title is null", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            title: null,
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The title attribute is required.",
        );
    });

    it("should not be created when title is empty", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            title: "",
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The title attribute is required.",
        );
    });

    it("should be created when title length is 1", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            title: "A",
        });
        await newOrganization.save();

        assert.lengthOf(
            newOrganization.title,
            1,
            "The title attribute should be of length 1.",
        );
    });

    it("should not be created when title is too long", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            title: new Array(257 + 1).join("A"),
        });
        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The title attribute should have a maximum of 256 characters.",
        );
    });

    it("should be created when description is undefined", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            description: undefined,
        });

        await newOrganization.save();
        assert.isFalse(
            newOrganization.isNew,
            "The log should be persisted to the database.",
        );
    });

    it("should be created when description is null", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            description: null,
        });

        await newOrganization.save();
        assert.isFalse(
            newOrganization.isNew,
            "The log should be persisted to the database.",
        );
    });

    it("should be created when description is empty", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            description: "",
        });
        await newOrganization.save();

        assert.lengthOf(
            newOrganization.description,
            0,
            "The description attribute should be of length 1.",
        );
    });

    it("should not be created when description is too long", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            description: new Array(513 + 1).join("A"),
        });
        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The description attribute should have a maximum of 512 characters.",
        );
    });

    it("should be created with a default value for createdAt", async () => {
        const newOrganization = new OrganizationModel({ ...organization });
        await newOrganization.save();
        assert.typeOf(
            newOrganization.createdAt,
            "date",
            "The createdAt attribute should be assigned by default.",
        );
    });

    it("should be created with a default value for updatedAt", async () => {
        const newOrganization = new OrganizationModel({ ...organization });
        await newOrganization.save();
        assert.typeOf(
            newOrganization.updatedAt,
            "date",
            "The updatedAt attribute should be assigned by default.",
        );
    });

    it("should not be created when status is invalid", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            status: "lorem",
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The status attribute is not from defined options.",
        );
    });

    it("should be created when status is undefined", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            status: undefined,
        });

        await newOrganization.save();
        assert.isFalse(
            newOrganization.isNew,
            "The log should be persisted to the database.",
        );
    });

    it("should not be created when members is undefined", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            members: undefined,
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The members attribute is required.",
        );
    });

    it("should not be created when members is null", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            members: null,
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The members attribute is required.",
        );
    });

    it("should not be created when members is empty", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            members: [],
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The members attribute is required.",
        );
    });

    it("should not be created when apps is undefined", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            apps: undefined,
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The apps attribute is required.",
        );
    });

    it("should not be created when apps is null", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            apps: null,
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The apps attribute is required.",
        );
    });

    it("should not be created when apps is empty", async () => {
        const newOrganization = new OrganizationModel({
            ...organization,
            apps: [],
        });

        await assertThrowsAsync(
            async () => newOrganization.save(),
            "The apps attribute is required.",
        );
    });
});
