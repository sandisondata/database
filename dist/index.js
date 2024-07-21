"use strict";
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
var _a, _Database_database;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const node_debug_1 = require("node-debug");
const node_postgresql_1 = require("node-postgresql");
const node_postgresql_config_1 = require("node-postgresql-config");
let debug;
const debugSource = 'database.class';
class Database {
    constructor(options) {
        debug = new node_debug_1.Debug(debugSource);
        debug.write(node_debug_1.MessageType.Entry, options ? `options=${JSON.stringify(options)}` : undefined);
        const configOptions = {};
        if (options && options.configFilePath) {
            configOptions.filePath = options.configFilePath;
        }
        if (options && options.repositoryNumber) {
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
        const config = (0, node_postgresql_config_1.generate)(Object.keys(configOptions).length > 0 ? configOptions : undefined);
        debug.write(node_debug_1.MessageType.Value, `config=${JSON.stringify((0, node_postgresql_config_1.redacted)(config))}`);
        debug.write(node_debug_1.MessageType.Step, 'Creating connection pool...');
        (0, node_postgresql_1.createConnectionPool)(config);
        debug.write(node_debug_1.MessageType.Exit);
    }
    static getInstance(options) {
        if (!__classPrivateFieldGet(this, _a, "f", _Database_database)) {
            __classPrivateFieldSet(this, _a, new _a(options), "f", _Database_database);
        }
        return __classPrivateFieldGet(this, _a, "f", _Database_database);
    }
    get query() {
        return node_postgresql_1.query;
    }
    get transaction() {
        return node_postgresql_1.transaction;
    }
}
exports.Database = Database;
_a = Database;
_Database_database = { value: void 0 };
