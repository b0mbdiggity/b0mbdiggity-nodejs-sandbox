import { SearchAfterParam, RecordByCursorOutput } from './SearchDTO';
import ConnectionManager from '../ConnectionManager';
declare class OpenSearchImpl {
    private static readonly client;
    private readonly db;
    constructor(db: ConnectionManager);
    static clientReady(): Promise<boolean>;
    private readonly index;
    private readonly bundleIndex;
    private init;
    private requestSearch;
    private requestSearchAfter;
    getRecord(id: string): Promise<any>;
    private requestSearchAfterBundle;
    getRecordsByCursor(searchAfterParam?: SearchAfterParam): Promise<RecordByCursorOutput>;
    getRecordsByCursorBundle(searchAfterParam?: SearchAfterParam): Promise<RecordByCursorOutput>;
}
export default OpenSearchImpl;
