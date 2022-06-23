import type { Plugin, PluginBuild } from "esbuild-wasm";

const source = `
const main = (): void => {
    console.log("Hello, world!");
};
main();
`;

export const hyperpack = (): Plugin => {
    return {
        name: "hyperpack",
        setup: (build: PluginBuild) => {
            const { onResolve, onLoad } = build;
            onResolve({ filter: /.*/ }, (values) => {
                return {
                    path: "/" + values.path.replace(/^\.\//, ""),
                    external: false,
                };
            });

            onLoad({ filter: /.*/ }, (values) => {
                const loader = "default";
                return { contents: source, loader };
            });
        },
    };
};
