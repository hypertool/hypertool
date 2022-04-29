import { IControllerPatch } from "@hypertool/common";

import { applyPatch } from "diff";

export const patchAll = (patches: IControllerPatch[]) =>
    patches.reduce(
        (previousValue: string, currentValue: { content: string }) => {
            const patched = applyPatch(previousValue, currentValue.content);
            if (!patched) {
                throw new Error(
                    "Failed to apply patch: " + currentValue.content,
                );
            }
            return patched;
        },
        "",
    );
