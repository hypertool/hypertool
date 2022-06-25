import { parseFragment } from "parse5";

export const generateJS = (root: any) => {
    let children = "";
    if (root.childNodes) {
        for (const childNode of root.childNodes) {
            if (!childNode.childNodes) {
                const child = childNode.value.trim();
                if (child) {
                    children += `"${child}", `;
                }
            } else {
                children += generateJS(childNode) + ",";
            }
        }
    }

    if (root.tagName === "img") {
        children = "";
    }

    return `React.createElement("${root.tagName}", ${JSON.stringify(
        Object.fromEntries(
            root.attrs?.map((attribute: { name: string; value: string }) => [
                attribute.name,
                attribute.value,
            ]) || [],
        ),
        null,
        4,
    )}, ${children})`;
};

export const transpileToJS = (source: string) => {
    const object = parseFragment(source);

    return `import React from "react";
export const useInflate = () => {
    return ${generateJS(object.childNodes[0])};
};`;
};
