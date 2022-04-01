import { useMemo } from "react";
import type { IApp, IHyperController } from "../types";

/* TODO: Evaluate all the controllers, not just the ones attached to screens. */
const useControllers = (app: IApp | null): Record<string, IHyperController<any>> =>
  useMemo(() => {
    const result: Record<string, IHyperController<any>> = {};

    if (app) {
      for (const screen of app.screens) {
        const { controller } = screen;
        // eslint-disable-next-line no-eval
        const object = eval(`"use strict"; (${controller.patched});`);
        result[controller.name] = object;
      }
    }

    return result;
  }, [app]);

export default useControllers;
