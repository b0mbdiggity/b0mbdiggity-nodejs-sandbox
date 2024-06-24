import { Moment } from 'moment';
import ConnectionManager from './ConnectionManager';
import TokenTransferEvent from './token/TokenTransferEvent';
declare class CommonRepository {
    private db;
    constructor(db: ConnectionManager);
    getLastSyncTime(): Promise<string>;
    getTokenEvents: (time: Moment) => Promise<TokenTransferEvent[]>;
    getTokenEventsDesc: (time: Moment) => Promise<TokenTransferEvent[]>;
    insertTransactionEvents: (events: TokenTransferEvent[]) => Promise<void>;
    deleteDoneTxHash: (events: TokenTransferEvent[]) => Promise<void>;
    getOrderMatches(offset: number): Promise<Array<{
        orderId: string;
        transactionHash: string;
    }>>;
    insertOrderMatched: (datas: Array<{
        orderId: string;
        transactionHash: string;
    }>) => Promise<void>;
    getTransactions(offset: number): Promise<Array<{
        txHash: string;
        input: string;
    }>>;
    insertTransactions: (datas: Array<{
        txHash: string;
        input: string;
    }>) => Promise<void>;
    getAliveOrders(tokenId: string, address: string, network: string): Promise<Array<any>>;
    getMetadata(tokenId: string, address: string, network: string): Promise<any | null>;
    getTokensByOrderId(orderId: string): Promise<any | null>;
    getTransactionEvents(lastCursor: string): Promise<Array<any>>;
    getOrderEvents(lastCursor: string): Promise<Array<any>>;
}
export default CommonRepository;
