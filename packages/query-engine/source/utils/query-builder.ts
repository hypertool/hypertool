import { Knex, knex } from "knex";

export class QueryBuilder {
    instance: Knex;

    constructor(instance: Knex) {
        this.instance = instance;
    }

    /* TODO: Add the following contructors in if clause of the current
     * constructor to support constructor overloading. Not required right now
     * as the current implementation is not using any other constructor.
     *
     * constructor(instance: Knex, tableName: string) {
     *    this.instance = instance.table(tableName);
     * }
     *
     * constructor(instance: Knex, tableName: string, alias: string) {
     *   this.instance = instance.table(tableName).as(alias);
     * }
     *
     * constructor(config: Knex.Config) {
     *   this.instance = knex(config);
     * }
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
        this.instance(query.table).select(query.select);
        this.whereClause(query);
    };

    insertStatement = (query: any) => {
        this.instance(query.table).insert(query.insert);
        this.whereClause(query);
    };

    updateStatement = (query: any) => {
        this.instance(query.table).update(query.update);
        this.whereClause(query);
    };

    deleteStatement = (query: any) => {
        this.instance(query.table).del(query.delete);
        this.whereClause(query);
    };

    whereClause = (query: any) => {
        if (query.where) {
            this.instance.where(query.where);
        }
    };
}
