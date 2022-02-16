import { assert } from "chai";

import {
    activityLogs,
    appData,
    comments,
    conversations,
    memberships,
    organizations,
    pages,
    queryTemplates,
    resources,
    users,
} from "./constants";

const assertThrowsAsync = async (
    callback,
    assertMessage,
    type = null,
    errorMessage = null,
) => {
    try {
        await callback();
    } catch (error) {
        if (type) {
            assert.instanceOf(
                error,
                type,
                `Exception should be of type ${type.name}`,
            );
        }

        if (errorMessage) {
            assert.strictEqual(error.message, errorMessage);
        }

        return;
    }

    assert.fail(assertMessage || "Expected an exception to be thrown");
};

export {
    activityLogs,
    appData,
    assertThrowsAsync,
    comments,
    conversations,
    memberships,
    organizations,
    pages,
    queryTemplates,
    resources,
    users,
};
