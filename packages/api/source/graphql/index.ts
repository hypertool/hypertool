import * as privateAPI from "./privateAPI";
import * as publicAPI from "./publicAPI";

const attachRoutes = async (app: any) => {
    await publicAPI.attachRoutes(app);
    await privateAPI.attachRoutes(app);
};

export { attachRoutes };
