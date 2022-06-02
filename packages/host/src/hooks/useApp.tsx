import { useContext } from "react";
import { AppContext } from "../contexts";
import type { TAppContext } from "../types";

const useApp = (): TAppContext => {
    const app = useContext(AppContext);
    if (!app) {
        throw new Error("Invalid application context!");
    }
    return app;
}

export default useApp;