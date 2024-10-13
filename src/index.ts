import { Debug, MessageType } from 'node-debug';
import {
  createConnectionPool,
  Query,
  query,
  shutdown,
  transaction,
  types,
} from 'node-postgresql';
import {
  generateConfig,
  Options as ConfigOptions,
  redactedConfig,
  RuleOverrides,
} from 'node-postgresql-config';

let debug: Debug;
const debugSource = 'database.class';

interface Options {
  configFilePath?: string;
  repositoryNumber?: number;
}

class Database {
  static #instance: Database | undefined;

  /**
   * Constructs a new Database object.
   *
   * This constructor is private, and can only be accessed through the static
   * `getInstance` method.
   */
  private constructor(options?: Options) {
    debug = new Debug(debugSource);
    debug.write(
      MessageType.Entry,
      options ? `options=${JSON.stringify(options)}` : undefined,
    );
    debug.write(MessageType.Step, 'Generating config options...');
    const configOptions: ConfigOptions = {};
    if (options?.configFilePath) {
      configOptions.filePath = options.configFilePath;
    }
    if (options?.repositoryNumber) {
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
      })}`,
    );
    debug.write(MessageType.Step, 'Generating config...');
    const config = generateConfig(
      Object.keys(configOptions).length ? configOptions : undefined,
    );
    debug.write(
      MessageType.Value,
      `config=${JSON.stringify(redactedConfig(config))}`,
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
    debug.write(MessageType.Step, 'Setting "datetime-tz" type parser...');
    types.setTypeParser(types.builtins.TIMESTAMPTZ, datetimeParser);
    debug.write(MessageType.Exit);
  }

  /**
   * Gets the singleton instance of the {@link Database} class.
   *
   * @param {Options} [options] The options used to initialize the database.
   * @returns {Database} The singleton instance of the {@link Database} class.
   */
  static getInstance(options?: Options): Database {
    if (!this.#instance) {
      this.#instance = new Database(options);
    }
    return this.#instance;
  }

  /**
   * Returns the query function that can be used to execute queries against the
   * database.
   *
   * @returns {Query} The query function that can be used to execute queries
   * against the database.
   */
  get query(): Query {
    return query;
  }

  /**
   * Returns the transaction function that can be used to execute transactions
   * against the database.
   *
   * @returns {(callback: (query: Query) => Promise<void>) => Promise<void>} The
   * transaction function that can be used to execute transactions against the
   * database.
   */
  get transaction(): (
    callback: (query: Query) => Promise<void>,
  ) => Promise<void> {
    return transaction;
  }

  /**
   * Shuts down the database connection.
   *
   * @returns {Promise<void>} A promise that resolves when the database connection
   * has been shut down.
   */
  async shutdown(): Promise<void> {
    await shutdown();
  }
}

export { Database, Options, Query };
