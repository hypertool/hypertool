import * as privateAPI from "./privateAPI";

const attachRoutes = async (app: any) => {
    await privateAPI.attachRoutes(app);
};

export { attachRoutes };