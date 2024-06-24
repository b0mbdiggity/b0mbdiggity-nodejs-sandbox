"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bundleSchema = new mongoose_1.Schema({
    tokens: { type: Object, required: true },
    owner: { type: String, required: true },
    network: { type: String, required: true },
    orderId: { type: String, required: true },
    categoryId: { type: Number, required: true },
    name: { type: String, required: false },
    imageUri: { type: Object, required: false },
    slug: { type: String, required: false },
    order: { type: Object, required: false },
});
const BundleModel = (0, mongoose_1.model)('Bundle', bundleSchema);
exports.default = BundleModel;
//# sourceMappingURL=bundle.js.map