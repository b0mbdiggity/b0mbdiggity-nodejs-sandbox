declare class Address {
    readonly value: string;
    static readonly nullAddress: Address;
    constructor(value: string);
    changeForm(withPrefix?: boolean, withCheckSum?: boolean): string;
    equals(address: Address): boolean;
    isSolanaAddress(): boolean;
    private isBase58;
}
export default Address;
