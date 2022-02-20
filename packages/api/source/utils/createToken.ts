import jwt from "jsonwebtoken";

const createToken = (values: any, expiresIn) => {
    const jwtToken = jwt.sign(values, process.env.JWT_SIGNATURE_KEY, {
        expiresIn,
    });

    return jwtToken;
};

export default createToken;
