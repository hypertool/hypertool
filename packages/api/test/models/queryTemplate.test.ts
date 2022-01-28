import { beforeEach } from "mocha";
import { QueryTemplateModel } from "@hypertool/common";
import { assert } from "chai";
import { assertThrowsAsync, queryTemplates } from "../helper";

describe("QueryTemplate Model", function () {
    let queryTemplate = null;

    beforeEach(function () {
        [queryTemplate] = queryTemplates;
    });

    afterEach(function () {
        queryTemplate = null;
    });

    it("should be created with correct data", async () => {
        const newQuery = new QueryTemplateModel({ ...queryTemplate });
        await newQuery.save();
        assert.isFalse(
            newQuery.isNew,
            "The query should be persisted to the database.",
        );
    });
});
