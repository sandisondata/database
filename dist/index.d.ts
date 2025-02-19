import { Query } from 'node-postgresql';
declare module 'node-postgresql' {
    interface Config {
        max: number;
    }
}
interface Options {
    configFilePath?: string;
    repositoryNumber?: number;
    maxPoolSize?: number;
}
declare class Database {
    #private;
    /**
     * Constructs a new Database object.
     *
     * This constructor is private, and can only be accessed through the static
     * `getInstance` method.
     */
    private constructor();
    /**
     * Gets the singleton instance of the {@link Database} class.
     *
     * @param {Options} [options] The options used to initialize the database.
     * @returns {Database} The singleton instance of the {@link Database} class.
     */
    static getInstance(options?: Options): Database;
    /**
     * Returns the query function that can be used to execute queries against the
     * database.
     *
     * @returns {Query} The query function that can be used to execute queries
     * against the database.
     */
    get query(): Query;
    /**
     * Returns the transaction function that can be used to execute transactions
     * against the database.
     *
     * @returns {(callback: (query: Query) => Promise<void>) => Promise<void>} The
     * transaction function that can be used to execute transactions against the
     * database.
     */
    get transaction(): (callback: (query: Query) => Promise<void>) => Promise<void>;
    /**
     * Disconnects from the database and resets the singleton instance.
     *
     * @returns {Promise<void>} A promise that resolves when the database connection
     * has been closed.
     */
    disconnect(): Promise<void>;
}
export { Database, Options, Query };
