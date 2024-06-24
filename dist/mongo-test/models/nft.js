"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nftSchema = new mongoose_1.Schema({
    tokenId: { type: String, required: true },
    network: { type: String, required: true },
    assetAddress: { type: String, required: true },
    assetTitle: { type: String, required: true },
    assetId: { type: Number, required: true },
    name: { type: String, required: false },
    imageUri: { type: String, required: false },
    lastTransferredAt: { type: Number, required: false },
    isInBundle: { type: Boolean, required: false },
    attributes: { type: Object, required: false },
    metadata: { type: Object, required: false },
    order: { type: Object, required: false },
    orders: { type: Object, required: false },
});
const NftModel = (0, mongoose_1.model)('Nft', nftSchema);
exports.default = NftModel;
//# sourceMappingURL=nft.js.map