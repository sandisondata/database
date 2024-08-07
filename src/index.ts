import { Debug, MessageType } from 'node-debug';
import {
  createConnectionPool,
  Query,
  query,
  transaction,
  types,
} from 'node-postgresql';
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

class Database {
  static #instance: Database;

  private constructor(options?: Options) {
    debug = new Debug(debugSource);
    debug.write(
      MessageType.Entry,
      options ? `options=${JSON.stringify(options)}` : undefined
    );
    debug.write(MessageType.Step, 'Generating config options...');
    const configOptions: ConfigOptions = {};
    if (options && options.configFilePath) {
      configOptions.filePath = options.configFilePath;
    }
    if (options && options.repositoryNumber) {
      const ruleOverrides: RuleOverrides = {
        database: () => {
          const prefix = process.env.POSTGRESQL_DATABASE_PREFIX;
          return (
            (prefix ? `${prefix}_` : '') +
            `repository_${options.repositoryNumber}`
          );
        },
      };
      configOptions.ruleOverrides = ruleOverrides;
    }
    debug.write(
      MessageType.Value,
      `configOptions=${JSON.stringify(configOptions, (key, value) => {
        if (typeof value == 'function') {
          return '<function>';
        }
        return value;
      })}`
    );
    debug.write(MessageType.Step, 'Generating config...');
    const config = generate(
      Object.keys(configOptions).length > 0 ? configOptions : undefined
    );
    debug.write(
      MessageType.Value,
      `config=${JSON.stringify(redacted(config))}`
    );
    debug.write(MessageType.Step, 'Creating connection pool...');
    createConnectionPool(config);
    debug.write(MessageType.Step, 'Setting "bigint" type parser...');
    types.setTypeParser(types.builtins.INT8, (value) => parseInt(value));
    debug.write(MessageType.Step, 'Setting "decimal" type parser...');
    types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value));
    debug.write(MessageType.Step, 'Setting "date" type parser...');
    types.setTypeParser(types.builtins.DATE, (value) => value);
    const datetimeParser = (value: string) => value.replace(' ', 'T');
    debug.write(MessageType.Step, 'Setting "datetime" type parser...');
    types.setTypeParser(types.builtins.TIMESTAMP, datetimeParser);
    debug.write(MessageType.Step, 'Setting "datetimetz" type parser...');
    types.setTypeParser(types.builtins.TIMESTAMPTZ, datetimeParser);
    debug.write(MessageType.Exit);
  }

  static getInstance(options?: Options) {
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

export { Database, Options, Query };
