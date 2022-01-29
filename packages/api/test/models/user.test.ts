import { UserModel } from "@hypertool/common";
import { assert } from "chai";
import { assertThrowsAsync, users } from "../helper";

describe("User Model", function () {
    let user = null;

    beforeEach(function () {
        [user] = users;
    });

    afterEach(function () {
        user = null;
    });

    it("should be created with correct data", async () => {
        const newUser = new UserModel({ ...user });
        await newUser.save();
        assert.isFalse(
            newUser.isNew,
            "The user should be persisted to the database.",
        );
    });

    it("should be created when firstName length is 1", async () => {
        const newUser = new UserModel({
            ...user,
            firstName: "A",
        });
        await newUser.save();

        assert.lengthOf(
            newUser.firstName,
            1,
            "The firstName attribute should be of length 1.",
        );
    });

    it("should not be created when firstName is too long", async () => {
        const newUser = new UserModel({
            ...user,
            firstName: new Array(31 + 1).join("a"),
        });
        await assertThrowsAsync(
            async () => newUser.save(),
            "The name attribute should have a maximum of 30 characters.",
        );
    });

    it("should not be created when firstName is undefined", async () => {
        const newUser = new UserModel({
            ...user,
            firstName: undefined,
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The firstName attribute is required.",
        );
    });

    it("should not be created when firstName is null", async () => {
        const newUser = new UserModel({
            ...user,
            firstName: null,
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The firstName attribute is required.",
        );
    });

    it("should not be created when firstName is empty", async () => {
        const newUser = new UserModel({
            ...user,
            firstName: "",
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The firstName attribute is required.",
        );
    });

    it("should be created when lastName length is 1", async () => {
        const newUser = new UserModel({
            ...user,
            lastName: "A",
        });
        await newUser.save();

        assert.lengthOf(
            newUser.lastName,
            1,
            "The lastName attribute should be of length 1.",
        );
    });

    it("should not be created when lastName is too long", async () => {
        const newUser = new UserModel({
            ...user,
            lastName: new Array(31 + 1).join("a"),
        });
        await assertThrowsAsync(
            async () => newUser.save(),
            "The name attribute should have a maximum of 30 characters.",
        );
    });

    it("should not be created when lastName is undefined", async () => {
        const newUser = new UserModel({
            ...user,
            lastName: undefined,
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The lastName attribute is required.",
        );
    });

    it("should not be created when lastName is null", async () => {
        const newUser = new UserModel({
            ...user,
            lastName: null,
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The lastName attribute is required.",
        );
    });

    it("should not be created when lastName is empty", async () => {
        const newUser = new UserModel({
            ...user,
            lastName: "",
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The lastName attribute is required.",
        );
    });

    it("should be created when description is empty", async () => {
        const newUser = new UserModel({
            ...user,
            description: "",
        });
        await newUser.save();

        assert.isFalse(
            newUser.isNew,
            "The user should be persisted to the database.",
        );
    });

    it("should not be created when description is too long", async () => {
        const newUser = new UserModel({
            ...user,
            description: new Array(513 + 1).join("a"),
        });
        await assertThrowsAsync(
            async () => newUser.save(),
            "The name attribute should have a maximum of 30 characters.",
        );
    });

    it("should be created when description is undefined", async () => {
        const newUser = new UserModel({
            ...user,
            description: undefined,
        });

        await newUser.save();

        assert.isFalse(
            newUser.isNew,
            "The user should be persisted to the database.",
        );
    });

    it("should be created when description is null", async () => {
        const newUser = new UserModel({
            ...user,
            description: null,
        });

        await newUser.save();

        assert.isFalse(
            newUser.isNew,
            "The user should be persisted to the database.",
        );
    });

    it("should be created when organization is null", async () => {
        const newUser = new UserModel({
            ...user,
            organization: null,
        });

        await newUser.save();
        assert.isFalse(
            newUser.isNew,
            "The user should be persisted to the database.",
        );
    });

    it("should be created when organization is undefined", async () => {
        const newUser = new UserModel({
            ...user,
            organization: undefined,
        });

        await newUser.save();
        assert.isFalse(
            newUser.isNew,
            "The user should be persisted to the database.",
        );
    });

    it("should not be created when gender is invalid", async () => {
        const newUser = new UserModel({
            ...user,
            gender: "lorem",
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The gender attribute is not from defined options.",
        );
    });

    it("should not be created when gender is undefined", async () => {
        const newUser = new UserModel({
            ...user,
            gender: undefined,
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The gender attribute is required.",
        );
    });

    it("should not be created when gender is null", async () => {
        const newUser = new UserModel({
            ...user,
            gender: null,
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The gender attribute is required.",
        );
    });

    it("should not be created when countryCode is invalid", async () => {
        const newUser = new UserModel({
            ...user,
            countryCode: "lorem",
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The countryCode attribute is not from defined options.",
        );
    });

    it("should not be created when countryCode is undefined", async () => {
        const newUser = new UserModel({
            ...user,
            countryCode: undefined,
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The countryCode attribute is required.",
        );
    });

    it("should not be created when countryCode is null", async () => {
        const newUser = new UserModel({
            ...user,
            countryCode: null,
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The countryCode attribute is required.",
        );
    });

    it("should be created when pictureURL is undefined", async () => {
        const newUser = new UserModel({
            ...user,
            pictureURL: undefined,
        });

        await newUser.save();

        assert.isFalse(
            newUser.isNew,
            "The user should be persisted to the database.",
        );
    });

    it("should be created when pictureURL is null", async () => {
        const newUser = new UserModel({
            ...user,
            pictureURL: null,
        });

        await newUser.save();

        assert.isFalse(
            newUser.isNew,
            "The user should be persisted to the database.",
        );
    });

    it("should not be created when status is invalid", async () => {
        const newUser = new UserModel({
            ...user,
            status: "lorem",
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The status attribute is not from defined options.",
        );
    });

    it("should not be created when status is undefined", async () => {
        const newUser = new UserModel({
            ...user,
            status: undefined,
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The status attribute is required.",
        );
    });

    it("should not be created when status is null", async () => {
        const newUser = new UserModel({
            ...user,
            status: null,
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The status attribute is required.",
        );
    });

    it("should not be created when role is invalid", async () => {
        const newUser = new UserModel({
            ...user,
            role: "lorem",
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The role attribute is not from defined options.",
        );
    });

    it("should not be created when role is undefined", async () => {
        const newUser = new UserModel({
            ...user,
            role: undefined,
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The role attribute is required.",
        );
    });

    it("should not be created when role is null", async () => {
        const newUser = new UserModel({
            ...user,
            role: null,
        });

        await assertThrowsAsync(
            async () => newUser.save(),
            "The role attribute is required.",
        );
    });

    it("should be created with a default value for createdAt", async () => {
        const newUser = new UserModel({ ...user });
        await newUser.save();
        assert.typeOf(
            newUser.createdAt,
            "date",
            "The createdAt attribute should be assigned by default.",
        );
    });

    it("should be created with a default value for updatedAt", async () => {
        const newUser = new UserModel({ ...user });
        await newUser.save();
        assert.typeOf(
            newUser.updatedAt,
            "date",
            "The updatedAt attribute should be assigned by default.",
        );
    });

    it("should be created when emailVerified is undefined", async () => {
        const newUser = new UserModel({
            ...user,
            emailVerified: undefined,
        });

        await newUser.save();

        assert.isFalse(
            newUser.isNew,
            "The user should be persisted to the database.",
        );
    });

    it("should be created when emailVerified is null", async () => {
        const newUser = new UserModel({
            ...user,
            emailVerified: null,
        });

        await newUser.save();

        assert.isFalse(
            newUser.isNew,
            "The user should be persisted to the database.",
        );
    });

    it("should be created when birthday is undefined", async () => {
        const newUser = new UserModel({
            ...user,
            birthday: undefined,
        });

        await newUser.save();

        assert.isFalse(
            newUser.isNew,
            "The user should be persisted to the database.",
        );
    });

    it("should be created when birthday is null", async () => {
        const newUser = new UserModel({
            ...user,
            birthday: null,
        });

        await newUser.save();

        assert.isFalse(
            newUser.isNew,
            "The user should be persisted to the database.",
        );
    });
});
