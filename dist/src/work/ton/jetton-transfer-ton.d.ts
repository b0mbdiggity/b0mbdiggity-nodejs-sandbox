import { Address } from "@ton/ton";
export declare function getUserJettonWalletAddress(userAddress: string, jettonMasterAddress: string): Promise<Address>;
export declare const transferTest: () => Promise<void>;
