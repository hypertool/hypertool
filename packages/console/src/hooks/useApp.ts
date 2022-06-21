import { useContext } from "react";
import AppContext from "../contexts/AppContext";
import { IApp } from "../types";

/**
 * The `useApp` hook returns the app currently open in the app builder
 * screen. It should be invoked within the context of `AppContext.Provider`.
 *
 * @returns The app currently open in the app builder.
 */
const useApp = (): IApp => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("Cannot find app context.");
    }

    return context;
};

export default useApp;
