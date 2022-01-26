import {
    Table,
    Column,
    ForeignKey,
    MySQLRawTable,
    MySQLRawColumn,
} from "../types";

function rawColumnToColumn(rawColumn: MySQLRawColumn): Column {
    let dataType = rawColumn.columnType.replace(/\(.*?\)/, "");
    if (rawColumn.columnType.startsWith("tinyint(1)")) {
        dataType = "boolean";
    }

    const column: Column = {
        name: rawColumn.columnName,
        table: rawColumn.tableName,
        dataType: dataType,
        defaultValue: rawColumn.columnDefault,
        generationExpression: rawColumn.generationExpression || null,
        maxLength: rawColumn.characterMaximumLength,
        numericPrecision: rawColumn.numericPrecision,
        numericScale: rawColumn.numericScale,
        isGenerated: !!rawColumn.extra?.endsWith("GENERATED"),
        isNullable: rawColumn.isNullable === "YES",
        isUnique: rawColumn.columnKey === "UNI",
        isPrimaryKey:
            rawColumn.constraintName === "PRIMARY" ||
            rawColumn.columnKey === "PRI",
        hasAutoIncrement: rawColumn.extra === "auto_increment",
        foreignKeyColumn: rawColumn.referencedColumnName,
        foreignKeyTable: rawColumn.referencedTableName,
        comment: rawColumn.columnComment,
    };

    return column;
}

export { rawColumnToColumn };
