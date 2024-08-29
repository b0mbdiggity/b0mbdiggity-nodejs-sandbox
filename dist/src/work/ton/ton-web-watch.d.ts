import { Address } from "@ton/ton";
export declare function getUserJettonWalletAddress(userAddress: string, jettonMasterAddress: string): Promise<Address>;
export declare function detectJettonTransfer(walletAddress: string, jettonMasterAddress: string): Promise<void>;
