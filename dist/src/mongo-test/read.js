"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const mongoose_1 = require("mongoose");
const nft_1 = __importDefault(require("./models/nft"));
const aggregate = async () => {
    await (0, mongoose_1.connect)('mongodb://localhost:27017/admin');
    const aggregatorOpts = [
        {
            $match: {
                tokenId: { $gte: '9000000' }
            }
        },
        {
            $facet: {
                byHero: [
                    {
                        $group: {
                            _id: "$attributes.hero",
                            count: { $sum: 1 }
                        }
                    }
                ],
            }
        }
    ];
    console.time('aggregate');
    const result = await nft_1.default.aggregate(aggregatorOpts).exec();
    console.timeEnd('aggregate');
    console.log(JSON.stringify(result, null, 2));
    (0, process_1.exit)();
};
const sort = async () => {
    await (0, mongoose_1.connect)('mongodb://localhost:27017/admin');
    const aggregatorOpts = [
        {
            $match: {
                tokenId: { $gte: '9000000' }
            }
        },
        {
            $addFields: {
                sortPriority: {
                    $switch: {
                        branches: [
                            {
                                'case': {
                                    $eq: [
                                        '$order.sale.currency',
                                        'PLA'
                                    ]
                                },
                                then: {
                                    $multiply: ['$order.sale.price', 0.214]
                                }
                            },
                            {
                                'case': {
                                    $eq: [
                                        '$order.sale.currency',
                                        'MATIC'
                                    ]
                                },
                                then: {
                                    $multiply: ['$order.sale.price', 0.865]
                                }
                            },
                            {
                                'case': {
                                    $eq: [
                                        '$order.sale.currency',
                                        'WETH'
                                    ]
                                },
                                then: {
                                    $multiply: ['$order.sale.price', 1272.827]
                                }
                            }
                        ],
                        'default': 0
                    }
                }
            }
        },
        {
            $sort: {
                'sortPriority': -1
            },
        },
        {
            $limit: 5,
        }
    ];
    console.time('aggregate');
    const result = await nft_1.default.aggregate(aggregatorOpts).explain();
    console.timeEnd('aggregate');
    console.log(JSON.stringify(result, null, 2));
    (0, process_1.exit)();
};
const updatePrice = async () => {
    await (0, mongoose_1.connect)('mongodb://localhost:27017/admin');
    console.time('update');
    const result = await nft_1.default.updateMany({
        tokenId: { $gte: '9000000' }
    }, [{
            $set: {
                'order.sale.usdPrice': {
                    $multiply: ['$order.sale.price', 0.214],
                }
            }
        }]);
    console.timeEnd('update');
    console.log(JSON.stringify(result, null, 2));
    (0, process_1.exit)();
};
sort();
//# sourceMappingURL=read.js.map