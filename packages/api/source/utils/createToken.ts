import jwt from "jsonwebtoken";

const createToken = (emailAddress: string, expiresIn) => {
    const jwtToken = jwt.sign({ emailAddress }, process.env.JWT_SIGNATURE_KEY, {
        expiresIn,
    });

    return jwtToken;
};

export default createToken;
