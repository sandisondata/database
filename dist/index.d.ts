import { Query } from 'node-postgresql';
interface Options {
    configFilePath?: string;
    repositoryNumber?: number;
}
declare class Database {
    #private;
    private constructor();
    static getInstance(options?: Options): Database;
    get query(): Query;
    get transaction(): (callback: (query: Query) => Promise<void>) => Promise<void>;
}
export { Database, Options, Query };
