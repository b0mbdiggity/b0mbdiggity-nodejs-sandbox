"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const CommonRepository_1 = __importDefault(require("./CommonRepository"));
const ConnectionManager_1 = __importDefault(require("./ConnectionManager"));
const MssqlDatabase_1 = __importDefault(require("./MssqlDatabase"));
const OpenSearchImpl_1 = __importDefault(require("./opensearch/OpenSearchImpl"));
const mongoose_1 = require("mongoose");
const bundle_1 = __importDefault(require("./mongo-test/models/bundle"));
const migrationBundles = async () => {
    await MssqlDatabase_1.default.getInstance();
    const db = new ConnectionManager_1.default();
    await db.init();
    const repo = new CommonRepository_1.default(db);
    const opensearch = new OpenSearchImpl_1.default(db);
    await (0, mongoose_1.connect)('mongodb+srv://playdapp:5sihnXEXPNrPHmVf@common-service-layer.dwctp.mongodb.net/nft?retryWrites=true&w=majority');
    let searchAfterParam = undefined;
    let offset = 0;
    while (true) {
        try {
            const result = await opensearch.getRecordsByCursorBundle(searchAfterParam);
            if (!result.records.length)
                break;
            searchAfterParam = {
                id: result.id,
                value: result.value,
            };
            const bundles = [];
            for (const record of result.records) {
                const tokens = await repo.getTokensByOrderId(record.orderId);
                const transform = {
                    ...record,
                    _id: undefined,
                    tokens,
                };
                bundles.push(new bundle_1.default(transform));
            }
            await bundle_1.default.bulkSave(bundles);
            console.log(offset, 'complete');
        }
        catch (e) {
            console.log(offset, e);
        }
        offset += 1;
    }
    console.log('done');
    (0, process_1.exit)();
};
migrationBundles();
//# sourceMappingURL=migrationBundle.js.map