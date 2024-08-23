"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tonTransfer = void 0;
const ton_1 = require("@ton/ton");
const crypto_1 = require("@ton/crypto");
const core_1 = require("@ton/core");
const ton_access_1 = require("@orbs-network/ton-access");
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function tonTransfer() {
    try {
        const mnemonic = "square gasp bonus pole join ivory memory sort empower carpet system mammal purse organ immune result copy unit section blast equal evidence goddess scrub";
        const key = await (0, crypto_1.mnemonicToWalletKey)(mnemonic.split(" "));
        console.log("publicKey >>", Buffer.from(key.publicKey).toString("base64"));
        const wallet = ton_1.WalletContractV5R1.create({
            publicKey: key.publicKey,
            workchain: 0,
        });
        const endpoint = await (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
        const client = new ton_1.TonClient({ endpoint });
        console.log("wallet.address >>", wallet.address);
        if (!(await client.isContractDeployed(wallet.address))) {
            return console.log("wallet is not deployed");
        }
        const walletContract = client.open(wallet);
        const seqno = await walletContract.getSeqno();
        await walletContract.sendTransfer({
            secretKey: key.secretKey,
            seqno: seqno,
            messages: [
                (0, core_1.internal)({
                    to: "0QD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjZQf",
                    value: "0.05",
                    body: "Hello",
                    bounce: false,
                }),
            ],
            sendMode: 0,
        });
        let currentSeqno = seqno;
        while (currentSeqno == seqno) {
            console.log("waiting for transaction to confirm...");
            await sleep(1500);
            currentSeqno = await walletContract.getSeqno();
        }
        console.log("transaction confirmed!");
    }
    catch (e) {
        console.log(e);
    }
}
exports.tonTransfer = tonTransfer;
//# sourceMappingURL=ton-transfer.js.map