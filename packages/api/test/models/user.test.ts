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
});
