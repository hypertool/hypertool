import { constants } from "@hypertool/common";
import type { IUser } from "@hypertool/common";

export interface IExecuteParameters {
    name: string;
    variables: Record<string, any>;
    format: typeof constants.queryResultFormats[number];
}

export interface IQueryResult {
    result: any;
    error?: any;
    meta?: any;
}

export interface IAuthOperation {
    name: string;
    test: (user: IUser, context: any) => boolean;
}

export interface IAuthResource {
    name: string;
    operations: IAuthOperation[];
}

export interface IAuthResourceGroup {
    name: string;
    resources: IAuthResource[];
}

export type TAccessType = "partial_read" | "read" | "write";
