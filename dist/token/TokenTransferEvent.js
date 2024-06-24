"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TokenTransferEvent {
    network;
    key;
    from;
    to;
    blockNumber;
    blockHash;
    eventTime;
    transactionHash;
    transactionFrom;
    transactionTo;
    logIndex;
    marketPaymentLog;
    constructor(network, key, from, to, blockNumber, blockHash, eventTime, transactionHash, transactionFrom, transactionTo, logIndex, marketPaymentLog) {
        this.network = network;
        this.key = key;
        this.from = from;
        this.to = to;
        this.blockNumber = blockNumber;
        this.blockHash = blockHash;
        this.eventTime = eventTime;
        this.transactionHash = transactionHash;
        this.transactionFrom = transactionFrom;
        this.transactionTo = transactionTo;
        this.logIndex = logIndex;
        this.marketPaymentLog = marketPaymentLog;
    }
}
exports.default = TokenTransferEvent;
//# sourceMappingURL=TokenTransferEvent.js.map