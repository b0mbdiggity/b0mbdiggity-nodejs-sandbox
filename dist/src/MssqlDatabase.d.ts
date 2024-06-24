import { ConnectionPool } from 'mssql';
export default class MssqlDatabase {
    private static singleton;
    private readonly connection;
    pool: ConnectionPool | undefined;
    private constructor();
    init(): Promise<void>;
    private setDbPool;
    static getInstance(): Promise<MssqlDatabase>;
    getPool(): Promise<ConnectionPool>;
}
