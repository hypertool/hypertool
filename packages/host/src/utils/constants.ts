const tuple = <T extends string[]>(...values: T) => values;

export const modifierKeys = tuple(
  "ALT",
  "ALT_GRAPH",
  "CAPS_LOCK",
  "CONTROL",
  "FN",
  "FN_LOCK",
  "META",
  "NUM_LOCK",
  "SCROLL_LOCK",
  "SHIFT",
  "SYMBOL",
  "SYMBOL_LOCK",
  "SUPER",
  "HYPER"
);

export const queryResultFormats = tuple("row", "column", "object");
