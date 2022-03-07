import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createToken = (values: any, expiresIn: string): string => {
    const jwtToken = jwt.sign(values, process.env.JWT_SIGNATURE_KEY, {
        expiresIn,
    });

    return jwtToken;
};

export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword: string = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (error, hash) => {
            if (error) {
                reject(error);
            }
            resolve(hash);
        });
    });

    return hashedPassword;
};
