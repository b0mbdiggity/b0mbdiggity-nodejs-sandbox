import { Moment } from 'moment';
import Address from '../Address';
import { OrderSide } from '../Config';
export default class MarketPaymentLog {
    readonly amount: string;
    readonly address: Address;
    readonly side: OrderSide;
    readonly blockTime: Moment;
    private readonly currencyAddress;
    private readonly data;
    constructor(currencyAddress: string, data: string, blockTime: Moment);
}
