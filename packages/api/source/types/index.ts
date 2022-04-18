import { constants } from "@hypertool/common";

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
