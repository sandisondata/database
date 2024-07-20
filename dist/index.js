"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreSQL = void 0;
const node_debug_1 = require("node-debug");
const node_postgresql_1 = require("node-postgresql");
const node_postgresql_config_1 = require("node-postgresql-config");
let debug;
const debugSource = 'postgresql';
class PostgreSQL {
    constructor(options) {
        this.options = options;
        debug = new node_debug_1.Debug(debugSource);
        debug.write(node_debug_1.MessageType.Entry, this.options ? `options=${JSON.stringify(options)}` : undefined);
        const configOptions = {};
        if (this.options && this.options.configFilePath) {
            configOptions.filePath = this.options.configFilePath;
        }
        if (this.options && this.options.repositoryNumber) {
            const overrideRules = {
                database: () => {
                    const prefix = process.env.POSTGRESQL_DATABASE_PREFIX;
                    return ((prefix ? `${prefix}_` : '') +
                        `repository_${this.options.repositoryNumber}`);
                },
            };
            configOptions.overrideRules = overrideRules;
        }
        const config = new node_postgresql_config_1.PostgreSQLConfig(Object.keys(configOptions).length > 0 ? configOptions : undefined);
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
exports.PostgreSQL = PostgreSQL;
