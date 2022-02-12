import { NextApiRequest, NextApiResponse } from "next";

export default (request: NextApiRequest, response: NextApiResponse) => {
    response.status(200).json({
        message: "The @hypertool/website service is active.",
    });
};
