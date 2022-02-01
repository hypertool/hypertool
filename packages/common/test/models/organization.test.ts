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
});
