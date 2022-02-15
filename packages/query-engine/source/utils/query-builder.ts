import { Knex, knex } from "knex";

export class QueryBuilder {
    knexInstance: Knex;

    constructor(knexInstance: Knex) {
        this.knexInstance = knexInstance;
    }

    /* TODO: Add the following contructors in if clause of the current
     * constructor to support constructor overloading. Not required right now
     * as the current implementation is not using any other constructor.
     *
     * constructor(knexInstance: Knex, tableName: string) {
     *    this.knexInstance = knexInstance.table(tableName);
     * }
     *
     * constructor(knexInstance: Knex, tableName: string, alias: string) {
     *   this.knexInstance = knexInstance.table(tableName).as(alias);
     * }
     *
     * constructor(config: Knex.Config) {
     *   this.knexInstance = knex(config);
     * }
     */

    /**
     * `parse()`
     *
     * The parse() methods triggers a call sequence (a tree) to build the query
     * tree, which will parse down the query tree. The query tree is an abstract
     * concept that is not represented in memory, instead  the call sequence
     * represents it. Once a leaf node is reached, the query is built.
     *
     * Example:
     * const queryBuilder = new QueryBuilder(knexInstance);
     * const queryExec = queryBuilder.parse(query);
     * const result = await queryExec;
     */
    parse = (query: any) => {
        if (query.hasOwnProperty("select") && query.select) {
            this.selectStatement(query);
        }

        if (query.hasOwnProperty("insert") && query.insert) {
            this.insertStatement(query);
        }

        if (query.hasOwnProperty("update") && query.update) {
            this.updateStatement(query);
        }

        if (query.hasOwnProperty("delete") && query.delete) {
            this.deleteStatement(query);
        }
    };

    selectStatement = (query: any) => {
        this.knexInstance(query.table).select(query.select);
        this.whereClause(query);
    };

    insertStatement = (query: any) => {
        this.knexInstance(query.table).insert(query.insert);
        this.whereClause(query);
    };

    updateStatement = (query: any) => {
        this.knexInstance(query.table).update(query.update);
        this.whereClause(query);
    };

    deleteStatement = (query: any) => {
        this.knexInstance(query.table).del(query.delete);
        this.whereClause(query);
    };

    whereClause = (query: any) => {
        if (query.where) {
            this.knexInstance.where(query.where);
        }
    };
}
