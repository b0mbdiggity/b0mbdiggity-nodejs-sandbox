"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const mongoose_1 = require("mongoose");
const nft_1 = __importDefault(require("./models/nft"));
const heroList = [
    'Alexis',
    'Atmos',
    'Cerberus',
    'Entia',
    'Lexius',
    'Mei',
    'Prospera',
    'Scarlett',
    'Shu',
    'Styx',
];
const typeList = [
    'Food',
    'Wood',
    'Gold',
    'Lumber',
];
const insertDatas = async (index) => {
    console.log('process', index);
    const nfts = [];
    for (let i = index * 100000; i < (index + 1) * 100000; i++) {
        nfts.push(new nft_1.default({
            tokenId: i.toString(),
            network: 'polygon',
            assetAddress: '0x7546D34FC15b25471072493e25150e0A8901Cd52',
            assetId: 1,
            assetTitle: 'LOK Item',
            attributes: {
                quantity: 100 * i,
                type: typeList[i % typeList.length],
                hero: heroList[i % heroList.length],
                'Awaken I': 'Stat: HP',
                'Awaken II': 'Physical Wall',
                'Awakening Level': 2,
                Class: 'Melee',
                'Current Lv': 10 * i,
                'Max Lv': 10 * i
            },
            imageUri: 'https://lok-nft.leagueofkingdoms.com/resource/10101021.png',
            isInBundle: false,
            lastTransferredAt: 1669250466000,
            name: 'Arrogant Grim Reaper Mei (★x6)',
            order: {
                auction: null,
                lastSoldInfo: {
                    currency: 'MATIC',
                    price: 0.149,
                    soldAt: 1669185627,
                },
                offer: {
                    highestOfferCreatedAt: 1669342930930,
                    highestOfferCurrency: 'PLA',
                    highestOfferPrice: 11.5,
                    offerTotalCount: 2
                },
                sale: {
                    createdAt: 1669337776280 - i,
                    currency: 'PLA',
                    price: 0.1 * i
                }
            }
        }));
    }
    await nft_1.default.bulkSave(nfts);
};
const loop = async () => {
    await (0, mongoose_1.connect)('mongodb://localhost:27017/admin');
    for (let i = 5; i < 100; i++) {
        await insertDatas(i);
    }
    (0, process_1.exit)();
};
loop();
//# sourceMappingURL=insertDatas.js.map