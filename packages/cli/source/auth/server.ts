import type { Request, Response } from "express";
import type { Server } from "http";

import express from "express";
import open from "open";

const startServer = (): Promise<string> =>
    new Promise((resolve) => {
        const app = express();
        let server: Server | null = null;

        app.get(
            "/oauth",
            async (request: Request, response: Response): Promise<void> => {
                response.send("Successfully authenticated!");
                server?.close();

                resolve(request.query.code as string);
            },
        );

        server = app.listen(2819, () => {
            const clientId =
                "590734770034-7ck6d902nujaucv4o2vttb9kfti0pqbu.apps.googleusercontent.com";
            const redirectURL = encodeURIComponent(
                "http://localhost:2819/oauth",
            );
            const scope = encodeURIComponent("openid email profile");
            open(
                `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectURL}&scope=${scope}&rsponse_mode=query&response_type=code`,
                {
                    wait: false,
                    newInstance: true,
                    allowNonzeroExitCode: false,
                },
            );
        });
    });

export { startServer };
