import { Debug, MessageType } from 'node-debug';
import {
  createConnectionPool,
  query,
  Query,
  transaction,
} from 'node-postgresql';
import {
  Options as ConfigOptions,
  OverrideRules,
  PostgreSQLConfig,
} from 'node-postgresql-config';

let debug: Debug;
const debugSource = 'postgresql';

export interface Options {
  configFilePath?: string;
  repositoryNumber?: number;
}

export class PostgreSQL {
  constructor(private readonly options?: Options) {
    debug = new Debug(debugSource);
    debug.write(
      MessageType.Entry,
      this.options ? `options=${JSON.stringify(options)}` : undefined
    );
    const configOptions: ConfigOptions = {};
    if (this.options && this.options.configFilePath) {
      configOptions.filePath = this.options.configFilePath;
    }
    if (this.options && this.options.repositoryNumber) {
      const overrideRules: OverrideRules = {
        database: () => {
          const prefix = process.env.POSTGRESQL_DATABASE_PREFIX!;
          return (
            (prefix ? `${prefix}_` : '') +
            `repository_${this.options!.repositoryNumber!}`
          );
        },
      };
      configOptions.overrideRules = overrideRules;
    }
    const config = new PostgreSQLConfig(
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
