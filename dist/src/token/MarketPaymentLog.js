"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = __importDefault(require("ethers"));
const Address_1 = __importDefault(require("../Address"));
const Config_1 = require("../Config");
class MarketPaymentLog {
    amount;
    address;
    side;
    blockTime;
    currencyAddress;
    data;
    constructor(currencyAddress, data, blockTime) {
        this.currencyAddress = currencyAddress;
        this.data = data;
        this.blockTime = blockTime;
        this.address =
            currencyAddress === "0x0000000000000000000000000000000000001010" ||
                !currencyAddress
                ? Address_1.default.nullAddress
                : new Address_1.default(currencyAddress);
        const dataCutHex = data.substring(2, data.length);
        const eventParams = dataCutHex.match(new RegExp(`.{1,${64}}`, "g"));
        this.amount = ethers_1.default.formatEther(BigInt(`0x${eventParams[2]}`));
        this.side =
            eventParams[0] > eventParams[1] ? Config_1.OrderSide.BUY : Config_1.OrderSide.SELL;
    }
}
exports.default = MarketPaymentLog;
//# sourceMappingURL=MarketPaymentLog.js.map