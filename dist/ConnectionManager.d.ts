/// <reference types="node" />
import { ISqlTypeFactory } from 'mssql';
export interface InputParameter {
    [key: string]: {
        value: Buffer | string | number | boolean | null;
        type: ISqlTypeFactory;
    };
}
export default class ConnectionManager {
    private tx;
    private pool;
    init(): Promise<void>;
    startTransaction(isolationLevel?: number): Promise<void>;
    commitTransaction(): Promise<boolean>;
    rollbackTransaction(): Promise<boolean>;
    prepareExcute(args: {
        query: string;
        inputParams?: InputParameter;
    }): Promise<Array<{
        [key: string]: any;
    }>>;
    private setInputTypes;
    private setInputValues;
}
