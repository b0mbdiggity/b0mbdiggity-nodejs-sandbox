"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batch = void 0;
const core_1 = require("@ton/core");
const crypto_1 = require("@ton/crypto");
const ton_access_1 = require("@orbs-network/ton-access");
const ton_1 = require("@ton/ton");
const highload_wallet_v3_1 = require("@tonkite/highload-wallet-v3");
const batch = async () => {
    const transfer = async () => {
        const mnemonic = "square gasp bonus pole join ivory memory sort empower carpet system mammal purse organ immune result copy unit section blast equal evidence goddess scrub";
        const key = await (0, crypto_1.mnemonicToWalletKey)(mnemonic.split(" "));
        const endpoint = await (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
        const tonClient = new ton_1.TonClient({
            endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
            apiKey: "064ea76e4dc0d0f65d6939b5d801c861446ca6b2b57bf243d8044b83d8ce7d9b",
        });
        const queryIdSequence = highload_wallet_v3_1.HighloadWalletV3.newSequence();
        const wallet = tonClient.open(new highload_wallet_v3_1.HighloadWalletV3(queryIdSequence, key.publicKey));
        await wallet.sendBatch(key.secretKey, {
            messages: [
                {
                    mode: core_1.SendMode.NONE,
                    message: (0, core_1.internal)({
                        to: core_1.Address.parse("0QD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjZQf"),
                        value: (0, core_1.toNano)("0.005"),
                        body: (0, core_1.comment)("Hello Tonkite!"),
                        bounce: false,
                    }),
                },
                {
                    mode: core_1.SendMode.NONE,
                    message: (0, core_1.internal)({
                        to: core_1.Address.parse("0QD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjZQf"),
                        value: (0, core_1.toNano)("0.005"),
                        body: (0, core_1.comment)("Hello Tonkite!"),
                    }),
                },
            ],
            valuePerBatch: (0, core_1.toNano)("0.015"),
            createdAt: Math.floor(Date.now() / 1000) - 60,
        });
    };
    await transfer();
};
exports.batch = batch;
//# sourceMappingURL=highload.js.map