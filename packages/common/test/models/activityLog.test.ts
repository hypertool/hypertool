import { assert } from "chai";
import { beforeEach } from "mocha";

import { ActivityLogModel } from "../../source/models";
import { activityLogs, assertThrowsAsync } from "../helper";

describe("ActivityLog model", function () {
    let logTemplate = null;

    beforeEach(function () {
        [logTemplate] = activityLogs;
    });

    afterEach(function () {
        logTemplate = null;
    });

    it("should be created with correct data", async () => {
        const newLog = new ActivityLogModel({ ...logTemplate });
        await newLog.save();
        assert.isFalse(
            newLog.isNew,
            "The log should be persisted to the database.",
        );
    });

    it("should not be created when message is undefined", async () => {
        const newLog = new ActivityLogModel({
            ...logTemplate,
            message: undefined,
        });

        await assertThrowsAsync(
            async () => newLog.save(),
            "The message attribute is required.",
        );
    });

    it("should not be created when message is null", async () => {
        const newLog = new ActivityLogModel({
            ...logTemplate,
            message: null,
        });

        await assertThrowsAsync(
            async () => newLog.save(),
            "The message attribute is required.",
        );
    });

    it("should not be created when message is empty", async () => {
        const newLog = new ActivityLogModel({
            ...logTemplate,
            message: "",
        });

        await assertThrowsAsync(
            async () => newLog.save(),
            "The message attribute is required.",
        );
    });

    it("should be created when message length is 1", async () => {
        const newLog = new ActivityLogModel({
            ...logTemplate,
            message: "A",
        });
        await newLog.save();

        assert.lengthOf(
            newLog.message,
            1,
            "The message attribute should be of length 1.",
        );
    });

    it("should not be created when message is too long", async () => {
        const newLog = new ActivityLogModel({
            ...logTemplate,
            message:
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
                "AAAAAAAAAAAAA",
        });
        await assertThrowsAsync(
            async () => newLog.save(),
            "The message attribute should have a maximum of 512 characters.",
        );
    });

    it("should not be created when component is undefined", async () => {
        const newLog = new ActivityLogModel({
            ...logTemplate,
            component: undefined,
        });

        await assertThrowsAsync(
            async () => newLog.save(),
            "The component attribute is required.",
        );
    });

    it("should not be created when component is null", async () => {
        const newLog = new ActivityLogModel({
            ...logTemplate,
            component: null,
        });

        await assertThrowsAsync(
            async () => newLog.save(),
            "The component attribute is required.",
        );
    });

    it("should not be created when component is empty", async () => {
        const newLog = new ActivityLogModel({
            ...logTemplate,
            component: "",
        });

        await assertThrowsAsync(
            async () => newLog.save(),
            "The component attribute is required.",
        );
    });

    it("should not be created when component is invalid", async () => {
        const newLog = new ActivityLogModel({
            ...logTemplate,
            component: "no-api",
        });

        await assertThrowsAsync(
            async () => newLog.save(),
            "The component attribute is not from defined origins.",
        );
    });

    it("should be created when context is null", async () => {
        const newLog = new ActivityLogModel({
            ...logTemplate,
            context: null,
        });
        await newLog.save();
        assert.isFalse(
            newLog.isNew,
            "The log should be persisted to the database.",
        );
    });

    it("should be created when context is undefined", async () => {
        const newLog = new ActivityLogModel({
            ...logTemplate,
            context: undefined,
        });
        await newLog.save();
        assert.isFalse(
            newLog.isNew,
            "The log should be persisted to the database.",
        );
    });

    it("should be created with a default value for createdAt", async () => {
        const newLog = new ActivityLogModel({ ...logTemplate });
        await newLog.save();
        assert.typeOf(
            newLog.createdAt,
            "date",
            "The createdAt attribute should be assigned by default.",
        );
    });

    it("should be created with a default value for updatedAt", async () => {
        const newLog = new ActivityLogModel({ ...logTemplate });
        await newLog.save();
        assert.typeOf(
            newLog.updatedAt,
            "date",
            "The updatedAt attribute should be assigned by default.",
        );
    });
});
