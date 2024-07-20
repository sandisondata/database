import { Debug, MessageType } from 'node-debug';
import { createConnectionPool, query, transaction } from 'node-postgresql';
import Config from 'node-postgresql-config';

let debug: Debug;
const debugSource = 'database';

interface Options {
  configFilePath?: string;
  repositoryNumber?: number;
}

export default class Database {
  constructor(private readonly options?: Options) {
    debug = new Debug(debugSource);
    debug.write(
      MessageType.Entry,
      this.options ? `options=${JSON.stringify(options)}` : undefined
    );
    const configOptions = {};
    if (this.options && this.options.configFilePath) {
      Object.defineProperty(
        configOptions,
        'filePath',
        this.options.configFilePath
      );
    }
    if (this.options && this.options.repositoryNumber) {
      const overrides = {
        database: () => {
          const prefix = process.env.POSTGRESQL_DATABASE_PREFIX!;
          return (
            (prefix ? `${prefix}_` : '') +
            `repository_${this.options!.repositoryNumber!}`
          );
        },
      };
      Object.defineProperty(configOptions, 'overrides', overrides);
    }
    const config = new Config(
      Object.keys(configOptions).length > 0 ? configOptions : undefined
    );
    debug.write(
      MessageType.Value,
      `configObject=${JSON.stringify(config.redactedObject)}`
    );
    createConnectionPool(config.object);
  }

  get query() {
    return query;
  }

  get transaction() {
    return transaction;
  }
}
