import { Moment } from 'moment';
import Address from '../Address';
import MarketPaymentLog from './MarketPaymentLog';
import TokenKey from './TokenKey';
export default class TokenTransferEvent {
    network: string;
    key: TokenKey;
    from: Address;
    to: Address;
    blockNumber: bigint;
    blockHash: string;
    eventTime: Moment;
    transactionHash: string;
    transactionFrom: Address;
    transactionTo: Address;
    logIndex: number;
    marketPaymentLog?: MarketPaymentLog;
    constructor(network: string, key: TokenKey, from: Address, to: Address, blockNumber: bigint, blockHash: string, eventTime: Moment, transactionHash: string, transactionFrom: Address, transactionTo: Address, logIndex: number, marketPaymentLog?: MarketPaymentLog);
}
