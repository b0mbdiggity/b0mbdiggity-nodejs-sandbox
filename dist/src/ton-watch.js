"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ton_1 = require("@ton/ton");
const ton_2 = require("./work/ton/ton");
const ton_access_1 = require("@orbs-network/ton-access");
const sandbox = async () => {
    const client = new ton_1.TonClient4({
        endpoint: await (0, ton_access_1.getHttpV4Endpoint)({ network: "testnet" }),
    });
    await (0, ton_2.processTxsForever)(ton_1.Address.parse("EQDRycYK9aOckuEUdrOSPmB7tjRUvv5ZPNaJTV1YNSdJCGyt"), client, undefined);
};
sandbox();
//# sourceMappingURL=ton-watch.js.map