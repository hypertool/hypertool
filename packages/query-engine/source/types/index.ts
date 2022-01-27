export interface ExecuteParameters {
    name: string;
    variables: any;
    format: string;
}

/**
 * This is a generic Table type that is used by all the databases.
 */
export interface Table {
    name: string;

    comment?: string | null;
    schema?: string;

    // MySQL only
    collation?: string;
    engine?: string;

    // Postgres only
    owner?: string;

    // MSSQL only
    catalog?: string;
}

/**
 * This is a generic Column type that is used by all the databases.
 */
export interface Column {
    name: string;
    table: string;
    dataType: string;
    defaultValue: any | null;
    maxLength: number | null;
    numericPrecision: number | null;
    numericScale: number | null;
    isNullable: boolean;
    isUnique: boolean;
    isPrimaryKey: boolean;
    isGenerated: boolean;
    generationExpression?: string | null;
    hasAutoIncrement: boolean;
    foreignKeyTable: string | null;
    foreignKeyColumn: string | null;
    comment?: string | null;

    // Postgres only
    schema?: string;
    foreignKeySchema?: string | null;
}

export interface ForeignKey {
    table: string;
    column: string;
    foreignKeyTable: string;
    foreignKeyColumn: string;
    foreignKeySchema?: string;
    constraintName: null | string;
    onUpdate:
        | null
        | "NO ACTION"
        | "RESTRICT"
        | "CASCADE"
        | "SET NULL"
        | "SET DEFAULT";
    onDelete:
        | null
        | "NO ACTION"
        | "RESTRICT"
        | "CASCADE"
        | "SET NULL"
        | "SET DEFAULT";
}

export interface MySQLRawTable {
    tableName: string;
    tableSchema: string;
    tableComment: string | null;
    engine: string;
    tableCollation: string;
}

export interface MySQLRawColumn {
    tableName: string;
    columnName: string;
    columnDefault: any | null;
    columnType: string;
    characterMaximumLength: number | null;
    numericPrecision: number | null;
    numericScale: number | null;
    isNullable: boolean;
    collationName: string | null;
    columnComment: string | null;
    referencedTableName: string | null;
    referencedColumnName: string | null;
    updateRule: string | null;
    deleteRule: string | null;
    columnKey: "PRI" | "UNI" | null;
    extra: "auto_increment" | "STORED GENERATED" | "VIRTUAL GENERATED" | null;
    constraintName: "PRIMARY" | null;
    generationExpression: string;
}
