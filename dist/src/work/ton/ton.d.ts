/// <reference types="node" />
import { Address, TonClient4 } from "@ton/ton";
export declare function processTxsForever(address: Address, client: TonClient4, known?: {
    hash: Buffer;
    lt: bigint;
}): Promise<void>;
