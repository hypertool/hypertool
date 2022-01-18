import { constants } from "../utils";

const { httpStatuses } = constants;

function toExternal(result) {
    return {};
}

function attachRoutes(router) {
    router.post("/mysql", async (request, response) => {
        return response.status(httpStatuses.OK).json({ hello: "world" });
    });
}

export { attachRoutes };
