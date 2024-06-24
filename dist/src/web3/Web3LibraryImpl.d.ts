import { TransactionReceipt } from "web3-core/types";
import { ContractSendMethodEx } from "./ContractSendMethodEx";
export default class Web3LibraryImpl {
    private readonly CHAIN_WATCH_RETRY_LIMIT;
    private readonly EVENT_WATCH_LIMIT_COUNT;
    private readonly EVENT_WATCH_INTERVAL;
    private readonly RETRY_LIMIT;
    private readonly MAX_GAS_PRICE;
    private web3;
    constructor();
    getContract(): import("web3-eth-contract/types").Contract;
    getMinterContract(): import("web3-eth-contract/types").Contract;
    sendMethod(method: ContractSendMethodEx, from: string, txHashCb?: (hash: string) => Promise<void>): Promise<TransactionReceipt>;
}
