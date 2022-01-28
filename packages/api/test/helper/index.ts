import { activityLogs, appData, queryTemplates } from "./constants";
import { assert } from "chai";

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

export { assertThrowsAsync, activityLogs, appData, queryTemplates };
