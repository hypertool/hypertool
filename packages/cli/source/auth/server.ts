import type { Request, Response } from "express";
import express from "express";
import type { Server } from "http";
import open from "open";
import path from "path";

const startServer = (): Promise<string> =>
    new Promise((resolve) => {
        const app = express();
        let server: Server | null = null;

        app.get(
            "/oauth",
            async (request: Request, response: Response): Promise<void> => {
                response.sendFile("success.html", {
                    root: path.join(__dirname, "../../../public/auth"),
                });
                server?.close();

                resolve(request.query.code as string);
            },
        );

        server = app.listen(2819, () => {
            const clientId =
                "700990591828-odb28j531ek1gvmq5kqf7qve8eh065n2.apps.googleusercontent.com";
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
