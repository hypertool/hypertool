const privateAPI = require("./privateAPI");
const publicAPI = require("./publicAPI");

const attachRoutes = async (app: any) => {
    await publicAPI.attachRoutes(app);
    await privateAPI.attachRoutes(app);
};

export { attachRoutes };
