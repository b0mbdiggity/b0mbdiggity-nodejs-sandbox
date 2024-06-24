import { Moment } from 'moment';
import Address from '../Address';
import TokenKey from './TokenKey';
export default class Token {
    readonly network: string;
    readonly owner: Address;
    readonly key: TokenKey;
    readonly ownedTime: Moment;
    constructor(network: string, key: TokenKey, owner: Address, ownedTime: Moment);
}
