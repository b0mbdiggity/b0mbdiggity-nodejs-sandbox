import Address from '../Address';
export default class TokenKey {
    readonly contractAddress: Address;
    readonly tokenId: string;
    readonly network: string;
    constructor(contractAddress: Address, tokenId: string, network: string);
    equals(other: TokenKey): boolean;
}
