import lodash from "lodash";

const isDifferent = (a: unknown, b: unknown, keys: string[]): boolean =>
    lodash.isMatch(lodash.pick(a, keys), lodash.pick(b, keys));

export { isDifferent };
