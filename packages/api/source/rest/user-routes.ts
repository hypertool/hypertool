import { NotFoundError, UserModel } from "@hypertool/common";
import type { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

const attachRoutes = async (router: Router): Promise<void> => {
    router.get(
        "/api/v1/accounts/verify/:jwtToken",
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
                    throw new NotFoundError("User Not found");
                }

                user.emailVerified = true;
                await user.save();
            } catch (err) {
                return response
                    .status(401)
                    .send("The specified token is invalid.");
            }
        },
    );
};

export { attachRoutes };
