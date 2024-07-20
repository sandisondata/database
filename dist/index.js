"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_debug_1 = require("node-debug");
const node_postgresql_1 = require("node-postgresql");
const node_postgresql_config_1 = __importDefault(require("node-postgresql-config"));
let debug;
const debugSource = 'database';
class Database {
    constructor(options) {
        this.options = options;
        debug = new node_debug_1.Debug(debugSource);
        debug.write(node_debug_1.MessageType.Entry, this.options ? `options=${JSON.stringify(options)}` : undefined);
        const configOptions = {};
        if (this.options && this.options.configFilePath) {
            Object.defineProperty(configOptions, 'filePath', this.options.configFilePath);
        }
        if (this.options && this.options.repositoryNumber) {
            const overrides = {
                database: () => {
                    const prefix = process.env.POSTGRESQL_DATABASE_PREFIX;
                    return ((prefix ? `${prefix}_` : '') +
                        `repository_${this.options.repositoryNumber}`);
                },
            };
            Object.defineProperty(configOptions, 'overrides', overrides);
        }
        const config = new node_postgresql_config_1.default(Object.keys(configOptions).length > 0 ? configOptions : undefined);
        debug.write(node_debug_1.MessageType.Value, `configObject=${JSON.stringify(config.redactedObject)}`);
        (0, node_postgresql_1.createConnectionPool)(config.object);
    }
    get query() {
        return node_postgresql_1.query;
    }
    get transaction() {
        return node_postgresql_1.transaction;
    }
}
exports.default = Database;
