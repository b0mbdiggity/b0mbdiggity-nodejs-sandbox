"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployJetton = void 0;
const ton_access_1 = require("@orbs-network/ton-access");
const ton_1 = require("@ton/ton");
const crypto_1 = require("@ton/crypto");
async function deployJetton() {
    const endpoint = await (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
    const client = new ton_1.TonClient({
        endpoint,
    });
    const mnemonic = "crash attitude rubber shop magic hockey visual embark inquiry monster aerobic warfare other hire account rally wealth glimpse music give actor frame off frost";
    const keyPair = await (0, crypto_1.mnemonicToWalletKey)(mnemonic.split(" "));
    const wallet = ton_1.WalletContractV5R1.create({
        publicKey: keyPair.publicKey,
        workchain: 0,
    });
    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();
    const jettonContent = {
        name: "My Jetton",
        description: "This is my first Jetton on TON",
        symbol: "MJT",
        image: "https://example.com/jetton-image.png",
    };
    const jettonMinter = ton_1.JettonMaster.create(wallet.address);
    console.log("Jetton Minter deployed at:", jettonMinter.address.toString());
}
exports.deployJetton = deployJetton;
//# sourceMappingURL=jetton-deploy.js.map