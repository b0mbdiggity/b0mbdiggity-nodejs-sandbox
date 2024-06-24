"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = require("mssql");
const Config_1 = require("./Config");
class MssqlDatabase {
    static singleton;
    connection;
    pool;
    constructor(mssqlConfig) {
        this.connection = new mssql_1.ConnectionPool(mssqlConfig);
    }
    async init() {
        await this.setDbPool(this.connection);
    }
    async setDbPool(pool) {
        this.pool = await pool.connect();
    }
    static async getInstance() {
        if (!this.singleton) {
            this.singleton = new MssqlDatabase(Config_1.DB_INFO);
            await this.singleton.init();
        }
        return this.singleton;
    }
    async getPool() {
        if (!this.pool) {
            throw new Error('pool is not initialized');
        }
        return this.pool;
    }
}
exports.default = MssqlDatabase;
//# sourceMappingURL=MssqlDatabase.js.map