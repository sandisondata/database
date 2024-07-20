import { Query } from 'node-postgresql';
export interface Options {
    configFilePath?: string;
    repositoryNumber?: number;
}
export declare class Database {
    private readonly options?;
    constructor(options?: Options | undefined);
    get query(): Query;
    get transaction(): (callback: (query: Query) => Promise<void>) => Promise<void>;
}
