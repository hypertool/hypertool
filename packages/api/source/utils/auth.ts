import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createToken = (values: any, expiresIn: string): string => {
    const jwtToken = jwt.sign(values, process.env.JWT_SIGNATURE_KEY, {
        expiresIn,
    });

    return jwtToken;
};

export const hashPassword = (password: string): string => {
    return bcrypt.hash(password, process.env.HASHING_KEY);
};
