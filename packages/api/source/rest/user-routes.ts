import { NotFoundError, UserModel, constants } from "@hypertool/common";

import type { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

const attachRoutes = async (router: Router): Promise<void> => {
    router.get(
        "/users/verify/:jwtToken",
        async (request: Request, response: Response) => {
            const { jwtToken } = request.params;
            try {
                const { emailAddress } = jwt.verify(
                    jwtToken,
                    process.env.JWT_SIGNATURE_KEY,
                );
                const user = await UserModel.findOne({
                    emailAddress,
                }).exec();

                if (!user) {
                    throw new NotFoundError(
                        "Cannot find user with the specified email address. (Inconsistent data state; possibly a bug.)",
                    );
                }

                user.emailVerified = true;
                await user.save();

                response.redirect(process.env.CONSOLE_URL);
            } catch (error) {
                response
                    .status(constants.httpStatuses.UNAUTHORIZED)
                    .send({ message: "The specified token is invalid." });
            }
        },
    );
};

export { attachRoutes };
