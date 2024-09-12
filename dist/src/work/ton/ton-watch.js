"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectTonTransfer = void 0;
const ton_access_1 = require("@orbs-network/ton-access");
const ton_1 = require("@ton/ton");
async function detectTonTransfer(walletAddress) {
    const endpoint = await (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
    const client = new ton_1.TonClient({
        endpoint,
    });
    const address = ton_1.Address.parse(walletAddress);
    let ttt = false;
    let transactions;
    while (!ttt) {
        try {
            transactions = await client.getTransactions(address, {
                limit: 100,
            });
            ttt = true;
        }
        catch (e) {
            console.log("failed");
        }
    }
    for (const tx of transactions) {
        if (tx.inMessage && tx.inMessage.info.type === "internal") {
            const amount = tx.inMessage.info.value.coins;
            const sender = tx.inMessage.info.src;
            console.log("tx.inMessage.body >>", tx.inMessage.body);
            let comment;
            const slice = tx.inMessage.body.beginParse();
            if (slice.remainingBits > 0) {
                const op = slice.loadUint(32);
                if (op === 0) {
                    try {
                        comment = slice.loadStringTail();
                    }
                    catch (error) {
                        console.log("what!!!!", error);
                    }
                }
            }
            console.log(`TON transfer detected:`);
            console.log(`Transaction Hash: ${tx.hash().toString("base64")}`);
            console.log(`Transaction Hash (Hex): ${tx.hash().toString("hex")}`);
            console.log(`Logical Time: ${tx.lt}`);
            console.log(`now: ${new Date(tx.now * 1000)}`);
            console.log(`Amount: ${amount} nanoTON`);
            console.log(`Sender: ${sender.toString({
                urlSafe: true,
                bounceable: false,
                testOnly: true,
            })}`);
            console.log(`Comment: ${comment || "No comment"}\n\n`);
        }
    }
}
exports.detectTonTransfer = detectTonTransfer;
//# sourceMappingURL=ton-watch.js.map