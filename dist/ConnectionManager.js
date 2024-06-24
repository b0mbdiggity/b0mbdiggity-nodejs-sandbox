"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = require("mssql");
const MssqlDatabase_1 = __importDefault(require("./MssqlDatabase"));
class ConnectionManager {
    tx;
    pool;
    async init() {
        const db = await MssqlDatabase_1.default.getInstance();
        this.pool = await db.getPool();
    }
    async startTransaction(isolationLevel = mssql_1.ISOLATION_LEVEL.READ_COMMITTED) {
        const transaction = new mssql_1.Transaction(this.pool);
        this.tx = await transaction.begin(isolationLevel);
    }
    async commitTransaction() {
        await this.tx?.commit();
        return true;
    }
    async rollbackTransaction() {
        await this.tx?.rollback();
        return true;
    }
    async prepareExcute(args) {
        let ps = null;
        if (this.tx)
            ps = new mssql_1.PreparedStatement(this.tx);
        else
            ps = new mssql_1.PreparedStatement(this.pool);
        try {
            const queryStrReplace = args.query.replace(/&&/, '@@');
            const values = {};
            if (args.inputParams) {
                await this.setInputTypes(args.inputParams, ps);
                Object.assign(values, await this.setInputValues(args.inputParams));
            }
            await ps.prepare(queryStrReplace);
            const result = await ps.execute(values);
            await ps.unprepare();
            return result.recordset;
        }
        catch (error) {
            throw new Error(`
      ${error}
    `);
        }
        finally {
            if (ps?.prepared)
                await ps.unprepare();
        }
    }
    async setInputTypes(inputParams, ps) {
        try {
            Object.keys(inputParams).map((key) => {
                ps.input(key, inputParams[key].type);
            });
        }
        catch (error) {
            throw new Error('setInputType exception');
        }
    }
    async setInputValues(inputParams) {
        try {
            const values = {};
            Object.keys(inputParams).map((key) => {
                values[key] = inputParams[key].value;
            });
            return values;
        }
        catch (error) {
            throw new Error('setInputValues exception');
        }
    }
}
exports.default = ConnectionManager;
//# sourceMappingURL=ConnectionManager.js.map