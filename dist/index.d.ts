interface Options {
    configFilePath?: string;
    repositoryNumber?: number;
}
export default class Database {
    private readonly options?;
    constructor(options?: Options | undefined);
    get query(): (text: string, values?: any[] | undefined) => Promise<QueryResult>;
    get transaction(): (callback: (query: (text: string, values?: any[] | undefined) => Promise<QueryResult>) => Promise<void>) => Promise<void>;
}
export {};
