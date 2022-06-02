import { useContext, useMemo } from "react";
import { ScreenContext } from "../contexts";
import { ISymbolReference } from "../types";
import useSymbolReference from "./useSymbolReference";

const useCallbackSymbol = <R extends Function>(
  reference?: ISymbolReference | Function | null
): R => {
  const symbol = useSymbolReference<R>(
    reference as ISymbolReference,
    typeof reference === "function"
  );
  const context = useContext(ScreenContext);
  const emptyFunction = useMemo(() => () => {}, []);

  if (typeof reference === "function") {
    return reference as any;
  }

  /* Check `!reference` only to satisfy TypeScript, because
   * `symbol` will be null if `reference` is null.
   */
  if (!reference || !symbol) {
    return emptyFunction as unknown as R;
  }

  if (!(symbol instanceof Function)) {
    throw new Error(
      `The referenced symbol "${reference.moduleId}.${reference.target}" is not a function.`
    );
  }

  return ((...values: any[]) => symbol(context, ...values)) as unknown as R;
};

export default useCallbackSymbol;
