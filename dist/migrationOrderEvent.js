"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const CommonRepository_1 = __importDefault(require("./CommonRepository"));
const ConnectionManager_1 = __importDefault(require("./ConnectionManager"));
const MssqlDatabase_1 = __importDefault(require("./MssqlDatabase"));
const moment_1 = __importDefault(require("moment"));
const OpenSearchImpl_1 = __importDefault(require("./opensearch/OpenSearchImpl"));
const mongoose_1 = require("mongoose");
const nftEvent_1 = __importDefault(require("./mongo-test/models/nftEvent"));
const devAssetInfo = [
    { assetId: '1', assetAddress: '0xd83556F5dA5DA628CcE90aa574D75a7305Ef3834' },
    { assetId: '2', assetAddress: '0x84a9ccEbd34504ac3644e795E438c73668236F4F' },
    { assetId: '3', assetAddress: '0x0b173DA467Cfa55801001a6585751f5C97833952' },
    { assetId: '4', assetAddress: '0xbAc404f82950D834dbd27d39bAEE552C7A9A2867' },
    { assetId: '5', assetAddress: '0x4d544035500d7ac1b42329c70eb58e77f8249f0f' },
    { assetId: '6', assetAddress: '0x2b5aE4f7a7e8A03AbaC05A6C3893D778972a5F81' },
    { assetId: '7', assetAddress: '0x8eE1C37724E1d492CE25d6F0D3a60DaC11bC7ad7' },
    { assetId: '8', assetAddress: '0x46Abb798189194f0cCA596F8B8C49172267c59E0' },
    { assetId: '18', assetAddress: '0x8d328fd2362acc8Ac87B5494Fd5fdB53c20a85Ec' },
    { assetId: '19', assetAddress: '0xe2E5094fd6e7AeE2046C08b98DD7e870d766194f' },
    { assetId: '20', assetAddress: '0x99ce1F928bE6b31dD220d38BBd8B390a5f1Cdd71' },
    { assetId: '21', assetAddress: '0xfF337B4Ff656888FAeEbb8a4F5f8a78552A331B3' },
    { assetId: '22', assetAddress: '0xfA89c41d94b327E9c36a7278484d55e539642082' },
    { assetId: '52', assetAddress: '0xb2a3d7202f11ABf0804451f13D5dceF612636eC1' },
    { assetId: '53', assetAddress: '0x7546D34FC15b25471072493e25150e0A8901Cd52' },
    { assetId: '54', assetAddress: 'AN7jf7vivqBEudAVhE12pmBmzQRi4TyuujX4aLzEGwQt' },
    { assetId: '55', assetAddress: 'CMAWeiRp4sYJVDJA7XAy4qyvX2ovLX848x4Qj5H3nK7D' },
    { assetId: '56', assetAddress: '0x5dEE7140BFb9B69340E70d0a8a52Ae27C962006a' },
    { assetId: '57', assetAddress: 'HCGJ4L2aF7NPRmJX2kkcEWH7CK61AdhvoLUnGAtpcTwY' },
    { assetId: '58', assetAddress: 'FL8Vk1noL79m1FfX55H1oudisfFzpsAxJz9r2eZEkWqi' },
    { assetId: '59', assetAddress: '6GQfZUbr7XEyRsaTNKaB1BXzKkJyZ96sBTmeanrBE73i' },
    { assetId: '62', assetAddress: '0x2C66c6E89D4e7FA4F130f7C5b0926205A44228eF' },
    { assetId: '63', assetAddress: '0x6C0CAc17Fe611b10bCC9eBaEb17054FdfDa7803E' },
    { assetId: '64', assetAddress: '0x006e3ad306Aca9AD3a5A642C4CDB8c63A2b15144' },
    { assetId: '65', assetAddress: '0x826bD777d09a099677E30D1bB882b16C0310CBc2' },
    { assetId: '66', assetAddress: '0x0471776f9d9699E5c8F5628cAB4BF7fDa3b5eC03' },
    { assetId: '67', assetAddress: '0xbADAB1321CDDBAb4d0a226c973b66d9F0AEe827E' },
    { assetId: '68', assetAddress: '0x90c0Cb30823D23d7874A5A6290E2EDc082E807c8' },
    { assetId: '69', assetAddress: '0xa8263e6D59b4d33f8a3662f58266E07D2FCb8C88' },
    { assetId: '70', assetAddress: '0x54eef35D2520D61f6b97C37c7240c3d1743C451E' },
    { assetId: '72', assetAddress: '7W2kg5crExHWWwD14DRTiShmzZydYBXRGDLSYwvuWJEm' },
    { assetId: '73', assetAddress: '0x50b2f3a9444E33ac870aEd8dF89c42f241e50eF8' },
];
const migrationTransactionEvent = async () => {
    await MssqlDatabase_1.default.getInstance();
    const db = new ConnectionManager_1.default();
    await db.init();
    const repo = new CommonRepository_1.default(db);
    const opensearch = new OpenSearchImpl_1.default(db);
    await (0, mongoose_1.connect)('mongodb+srv://playdapp:5sihnXEXPNrPHmVf@common-service-layer.dwctp.mongodb.net/stat?retryWrites=true&w=majority');
    let offset = 0;
    let cursor = 'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ';
    while (true) {
        try {
            const result = await repo.getOrderEvents(cursor);
            if (!result.length)
                break;
            const bundles = [];
            for (const record of result) {
                try {
                    const tokenIds = record.token_ids.split(',');
                    const tokens = [];
                    for (const tokenId of tokenIds) {
                        const assetId = devAssetInfo.find(e => e.assetAddress.toUpperCase() === record.contract_address.toUpperCase())?.assetId;
                        const id = `${assetId}-${tokenId}`;
                        const document = await opensearch.getRecord(id);
                        tokens.push({
                            network: record.network,
                            assetAddress: record.address,
                            assetTitle: document?.assetTitle,
                            assetId: document?.assetId,
                            tokenId: record.token_id,
                            name: document?.name,
                            imageUri: document?.imageUri,
                            attributes: document?.attributes,
                        });
                    }
                    const transform = {
                        eventTime: (0, moment_1.default)(record.event_time).unix(),
                        eventType: record.event_type === 'CREATE' ? 'order' : 'orderCancel',
                        network: record.network,
                        assetAddress: record.contract_address,
                        from: record.maker,
                        price: record.price,
                        currencyAddress: record.currency_address,
                        orderType: record.type,
                        sdkData: record.attribute,
                        tokens,
                    };
                    bundles.push(new nftEvent_1.default(transform));
                }
                catch (e) {
                    console.log(record, e);
                }
            }
            cursor = `${result[result.length - 1].order_id}${result[result.length - 1].event_type}`;
            await nftEvent_1.default.bulkSave(bundles);
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
migrationTransactionEvent();
//# sourceMappingURL=migrationOrderEvent.js.map