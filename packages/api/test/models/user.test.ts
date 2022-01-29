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
            "The query should be persisted to the database.",
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
});
