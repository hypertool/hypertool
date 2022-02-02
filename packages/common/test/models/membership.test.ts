import { assert } from "chai";

import { MembershipModel } from "../../source/models";

import { assertThrowsAsync, memberships } from "../helper";

describe("Membership model", function () {
    let membership = null;

    beforeEach(function () {
        [membership] = memberships;
    });

    afterEach(function () {
        membership = null;
    });

    it("should be created with correct data", async () => {
        const newMembership = new MembershipModel({ ...membership });
        await newMembership.save();
        assert.isFalse(
            newMembership.isNew,
            "The membership should be persisted to the database.",
        );
    });

    it("should be created with a default value for createdAt", async () => {
        const newMembership = new MembershipModel({ ...membership });
        await newMembership.save();
        assert.typeOf(
            newMembership.createdAt,
            "date",
            "The createdAt attribute should be assigned by default.",
        );
    });

    it("should be created with a default value for updatedAt", async () => {
        const newMembership = new MembershipModel({ ...membership });
        await newMembership.save();
        assert.typeOf(
            newMembership.updatedAt,
            "date",
            "The updatedAt attribute should be assigned by default.",
        );
    });

    it("should not be created when member is undefined", async () => {
        const newMembership = new MembershipModel({
            ...membership,
            member: undefined,
        });

        await assertThrowsAsync(
            async () => newMembership.save(),
            "The member attribute is required.",
        );
    });

    it("should not be created when member is null", async () => {
        const newMembership = new MembershipModel({
            ...membership,
            member: null,
        });

        await assertThrowsAsync(
            async () => newMembership.save(),
            "The member attribute is required.",
        );
    });

    it("should not be created when member is empty", async () => {
        const newMembership = new MembershipModel({
            ...membership,
            member: "",
        });

        await assertThrowsAsync(
            async () => newMembership.save(),
            "The member attribute is required.",
        );
    });

    it("should not be created when inviter is undefined", async () => {
        const newMembership = new MembershipModel({
            ...membership,
            inviter: undefined,
        });

        await assertThrowsAsync(
            async () => newMembership.save(),
            "The inviter attribute is required.",
        );
    });

    it("should not be created when inviter is null", async () => {
        const newMembership = new MembershipModel({
            ...membership,
            inviter: null,
        });

        await assertThrowsAsync(
            async () => newMembership.save(),
            "The inviter attribute is required.",
        );
    });

    it("should not be created when inviter is empty", async () => {
        const newMembership = new MembershipModel({
            ...membership,
            inviter: "",
        });

        await assertThrowsAsync(
            async () => newMembership.save(),
            "The inviter attribute is required.",
        );
    });

    it("should not be created when division is undefined", async () => {
        const newMembership = new MembershipModel({
            ...membership,
            division: undefined,
        });

        await assertThrowsAsync(
            async () => newMembership.save(),
            "The division attribute is required.",
        );
    });

    it("should not be created when division is null", async () => {
        const newMembership = new MembershipModel({
            ...membership,
            division: null,
        });

        await assertThrowsAsync(
            async () => newMembership.save(),
            "The division attribute is required.",
        );
    });

    it("should not be created when division is empty", async () => {
        const newMembership = new MembershipModel({
            ...membership,
            division: "",
        });

        await assertThrowsAsync(
            async () => newMembership.save(),
            "The division attribute is required.",
        );
    });
});
