import { Query } from 'node-postgresql';
interface Options {
    configFilePath?: string;
    repositoryNumber?: number;
}
declare class Database {
    #private;
    private constructor();
    static getInstance(options?: Options): Database;
    get query(): (text: string, values?: any[]) => Promise<import("pg").QueryResult>;
    get shutdown(): () => Promise<void>;
    get transaction(): (callback: (query: Query) => Promise<void>) => Promise<void>;
}
export { Database, Options, Query };
