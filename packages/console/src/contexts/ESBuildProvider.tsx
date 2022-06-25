import type { FunctionComponent, ReactElement, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

import esbuild from "esbuild-wasm";

import { Splash } from "../components";
import { hyperpack } from "../hyperpack";

import ESBuildContext from "./ESBuildContext";

export interface IESBuildProviderProps {
    children: ReactNode;
}

const ESBuildProvider: FunctionComponent<IESBuildProviderProps> = (
    props: IESBuildProviderProps,
): ReactElement => {
    const { children } = props;
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            await esbuild.initialize({
                wasmURL:
                    "https://www.unpkg.com/esbuild-wasm@0.14.43/esbuild.wasm",
            });

            if (mounted) {
                setInitializing(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const handleBuild = useCallback(async () => {
        const result = await esbuild.build({
            entryPoints: ["index.ts"],
            plugins: [hyperpack()],
        });
        console.log(result);

        return result;
    }, []);

    if (initializing) {
        return <Splash />;
    }

    return (
        <ESBuildContext.Provider
            value={{
                build: handleBuild,
            }}
        >
            {children}
        </ESBuildContext.Provider>
    );
};

export default ESBuildProvider;
