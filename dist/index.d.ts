import { Query } from 'node-postgresql';
export interface Options {
    configFilePath?: string;
    repositoryNumber?: number;
}
export declare class Database {
    #private;
    private constructor();
    static getInstance(options?: Options): Database;
    get query(): Query;
    get transaction(): (callback: (query: Query) => Promise<void>) => Promise<void>;
}
