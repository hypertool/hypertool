export { default as theme } from "./theme";
export * as templates from "./templates";
export * as constants from "./constants";
export * as files from "./files";

export type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T;

export const truthy = <T>(value: T): value is Truthy<T> => {
    return !!value;
};
