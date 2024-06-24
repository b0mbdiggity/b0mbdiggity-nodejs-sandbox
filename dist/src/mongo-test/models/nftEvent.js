"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nftEventSchema = new mongoose_1.Schema({
    eventTime: { type: Number, required: true },
    eventType: { type: String, required: true },
    network: { type: String, required: true },
    assetAddress: { type: String, required: true },
    tokenId: { type: String, required: false },
    from: { type: String, required: false },
    to: { type: String, required: false },
    blockNumber: { type: Number, required: false },
    transactionHash: { type: String, required: false },
    tokens: { type: Object, required: false },
    price: { type: Number, required: false },
    currencyAddress: { type: String, required: false },
    tradeType: { type: String, required: false },
    orderId: { type: String, required: false },
    orderType: { type: String, required: false },
    sdkData: { type: Object, required: false },
});
const NftEventModel = (0, mongoose_1.model)('Nft-event', nftEventSchema);
exports.default = NftEventModel;
//# sourceMappingURL=nftEvent.js.map