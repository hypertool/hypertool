export interface IExecuteParameters {
    name: string;
    variables: Record<string, any>;
    format: string;
}

export interface IQueryResult {
    result: any;
    error?: any;
    meta?: any;
}
