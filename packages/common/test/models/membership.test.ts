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
});
