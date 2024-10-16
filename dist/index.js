"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _Database_instance;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const node_debug_1 = require("node-debug");
const node_postgresql_1 = require("node-postgresql");
const node_postgresql_config_1 = require("node-postgresql-config");
class Database {
    /**
     * Constructs a new Database object.
     *
     * This constructor is private, and can only be accessed through the static
     * `getInstance` method.
     */
    constructor(options) {
        const debug = new node_debug_1.Debug('database');
        debug.write(node_debug_1.MessageType.Entry, options ? `options=${JSON.stringify(options)}` : undefined);
        debug.write(node_debug_1.MessageType.Step, 'Generating config options...');
        const configOptions = {};
        if (options === null || options === void 0 ? void 0 : options.configFilePath) {
            configOptions.filePath = options.configFilePath;
        }
        if (options === null || options === void 0 ? void 0 : options.repositoryNumber) {
            const ruleOverrides = {
                database: () => {
                    const prefix = process.env.POSTGRESQL_DATABASE_PREFIX;
                    return ((prefix ? `${prefix}_` : '') +
                        `repository_${options.repositoryNumber}`);
                },
            };
            configOptions.ruleOverrides = ruleOverrides;
        }
        debug.write(node_debug_1.MessageType.Value, `configOptions=${JSON.stringify(configOptions, (key, value) => {
            if (typeof value == 'function') {
                return '<function>';
            }
            return value;
        })}`);
        debug.write(node_debug_1.MessageType.Step, 'Generating config...');
        const config = (0, node_postgresql_config_1.generateConfig)(Object.keys(configOptions).length ? configOptions : undefined);
        debug.write(node_debug_1.MessageType.Value, `config=${JSON.stringify((0, node_postgresql_config_1.redactedConfig)(config))}`);
        debug.write(node_debug_1.MessageType.Step, 'Creating connection pool...');
        (0, node_postgresql_1.createConnectionPool)(config);
        debug.write(node_debug_1.MessageType.Step, 'Setting "bigint" type parser...');
        node_postgresql_1.types.setTypeParser(node_postgresql_1.types.builtins.INT8, (value) => parseInt(value));
        debug.write(node_debug_1.MessageType.Step, 'Setting "decimal" type parser...');
        node_postgresql_1.types.setTypeParser(node_postgresql_1.types.builtins.NUMERIC, (value) => parseFloat(value));
        debug.write(node_debug_1.MessageType.Step, 'Setting "date" type parser...');
        node_postgresql_1.types.setTypeParser(node_postgresql_1.types.builtins.DATE, (value) => value);
        const datetimeParser = (value) => value.replace(' ', 'T');
        debug.write(node_debug_1.MessageType.Step, 'Setting "datetime" type parser...');
        node_postgresql_1.types.setTypeParser(node_postgresql_1.types.builtins.TIMESTAMP, datetimeParser);
        debug.write(node_debug_1.MessageType.Step, 'Setting "datetime-tz" type parser...');
        node_postgresql_1.types.setTypeParser(node_postgresql_1.types.builtins.TIMESTAMPTZ, datetimeParser);
        debug.write(node_debug_1.MessageType.Exit);
    }
    /**
     * Gets the singleton instance of the {@link Database} class.
     *
     * @param {Options} [options] The options used to initialize the database.
     * @returns {Database} The singleton instance of the {@link Database} class.
     */
    static getInstance(options) {
        if (!__classPrivateFieldGet(this, _a, "f", _Database_instance)) {
            __classPrivateFieldSet(this, _a, new _a(options), "f", _Database_instance);
        }
        return __classPrivateFieldGet(this, _a, "f", _Database_instance);
    }
    /**
     * Returns the query function that can be used to execute queries against the
     * database.
     *
     * @returns {Query} The query function that can be used to execute queries
     * against the database.
     */
    get query() {
        return node_postgresql_1.query;
    }
    /**
     * Returns the transaction function that can be used to execute transactions
     * against the database.
     *
     * @returns {(callback: (query: Query) => Promise<void>) => Promise<void>} The
     * transaction function that can be used to execute transactions against the
     * database.
     */
    get transaction() {
        return node_postgresql_1.transaction;
    }
    /**
     * Disconnects from the database and resets the singleton instance.
     *
     * @returns {Promise<void>} A promise that resolves when the database connection
     * has been closed.
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, node_postgresql_1.shutdown)();
            __classPrivateFieldSet(_a, _a, undefined, "f", _Database_instance);
        });
    }
}
exports.Database = Database;
_a = Database;
_Database_instance = { value: void 0 };
