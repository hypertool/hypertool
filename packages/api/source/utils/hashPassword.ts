import bcrypt from "bcrypt";

const hashPassword = (password: string) => {
    const hashedPassword = bcrypt.hash(password, process.env.HASHING_KEY);

    return hashedPassword;
};

export default hashPassword;
