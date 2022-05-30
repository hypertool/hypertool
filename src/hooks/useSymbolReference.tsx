import { useContext } from "react";
import { ControllersContext } from "../contexts";
import { ISymbolReference } from "../types";

const useSymbolReference = <R,>(
  reference?: ISymbolReference | null,
  ignore = false
): R | null => {
  const context = useContext(ControllersContext);
  if (!context) {
    throw new Error("Could not find controllers context.");
  }

  if (!reference) {
    return null;
  }

  if (ignore) {
    return null;
  }

  const controller = context[reference.moduleId];
  if (!controller) {
    throw new Error(
      `Could not find controller with ID "${reference.moduleId}".`
    );
  }

  const symbol = (controller as any)[reference.target];
  if (!symbol) {
    throw new Error(
      `Could not find symbol with name "${reference.target}", in controller "${reference.moduleId}".`
    );
  }

  return symbol as R;
};

export default useSymbolReference;
