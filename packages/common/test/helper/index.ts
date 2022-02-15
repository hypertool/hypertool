import { assert } from "chai";

import {
    activityLogs,
    appData,
    comments,
    conversations,
    memberships,
    organizations,
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
    assertThrowsAsync,
    activityLogs,
    appData,
    queryTemplates,
    users,
    resources,
    organizations,
    memberships,
    conversations,
    comments,
};
