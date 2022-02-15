import { Knex } from "knex";

export default class QueryBuilder {
    knexInstance: Knex;

    constructor(knexInstance: Knex) {
        this.knexInstance = knexInstance;
    }

    /**
     * `parse()`
     *
     * The parse() methods triggers a call sequence (a tree) to build the query
     * tree, which will parse down the query tree. The query tree is an abstract
     * concept that is not represented in memory, instead  the call sequence
     * represents it. Once a leaf node is reached, a series of return calls that
     * return a knex instance back to the intial caller.
     *
     * Example:
     * const queryBuilder = new QueryBuilder(knexInstance);
     * const queryExec = queryBuilder.parse(query);
     * const result = await queryExec;
     */
    parse = () => {
        throw new Error("Method not implemented.");
    };
}
