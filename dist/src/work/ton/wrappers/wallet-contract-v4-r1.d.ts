/// <reference types="node" />
import { WalletContractV4 as WalletContractV4R2 } from "@ton/ton";
import { Buffer } from "buffer";
export declare class WalletContractV4R1 {
    static create(args: {
        workchain: number;
        publicKey: Buffer;
        walletId?: number | null;
    }): WalletContractV4R2;
}
