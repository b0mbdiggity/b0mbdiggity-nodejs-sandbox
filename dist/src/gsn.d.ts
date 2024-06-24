import { Signer, TransactionResponse } from "ethers";
export declare class SkpGSN {
    private gsnRpcGatewayProvider;
    private contract;
    private forwarderAddress;
    private chainId;
    private uptnRpcProvider;
    private dataSigner;
    constructor(signer: Signer);
    gsnTransact(contractAddress: string, calldata: string, signer: Signer): Promise<TransactionResponse | null>;
    private getNonceFromForwarder;
}
