import type { Document } from "mongoose";

import { constants } from "../utils";

const { httpStatuses } = constants;

function toExternal(result) {
    return {};
}

const attachRoutes = (router: any): void => {
    router.post("/mysql", async (request, response) => {
        console.log(request.body);

        return response.status(httpStatuses.OK).json({ hello: "world" });
    });
};

export { attachRoutes };
