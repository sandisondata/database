import { Debug, MessageType } from 'node-debug';
import { createConnectionPool, query, transaction } from 'node-postgresql';
import {
  generate,
  Options as ConfigOptions,
  redacted,
  RuleOverrides,
} from 'node-postgresql-config';

let debug: Debug;
const debugSource = 'database.class';

interface Options {
  configFilePath?: string;
  repositoryNumber?: number;
}

export class Database {
  static #instance: Database;

  private constructor(options?: Options) {
    debug = new Debug(debugSource);
    debug.write(
      MessageType.Entry,
      options ? `options=${JSON.stringify(options)}` : undefined
    );
    const configOptions: ConfigOptions = {};
    if (options && options.configFilePath) {
      configOptions.filePath = options.configFilePath;
    }
    if (options && options.repositoryNumber) {
      const ruleOverrides: RuleOverrides = {
        database: () => {
          const prefix = process.env.POSTGRESQL_DATABASE_PREFIX!;
          return (
            (prefix ? `${prefix}_` : '') +
            `repository_${options.repositoryNumber}`
          );
        },
      };
      configOptions.ruleOverrides = ruleOverrides;
    }
    const config = generate(
      Object.keys(configOptions).length > 0 ? configOptions : undefined
    );
    debug.write(
      MessageType.Value,
      `config=${JSON.stringify(redacted(config))}`
    );
    createConnectionPool(config);
  }

  public static getInstance(options?: Options) {
    if (!this.#instance) {
      this.#instance = new Database(options);
    }
    return this.#instance;
  }

  get query() {
    return query;
  }

  get transaction() {
    return transaction;
  }
}
