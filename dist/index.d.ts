interface Options {
    configFilePath?: string;
    repositoryNumber?: number;
}
export declare class Database {
    #private;
    private constructor();
    static getInstance(options?: Options): Database;
    get query(): import("node-postgresql").Query;
    get transaction(): (callback: (query: import("node-postgresql").Query) => Promise<void>) => Promise<void>;
}
export {};
