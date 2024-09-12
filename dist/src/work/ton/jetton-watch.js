"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectJettonTransfer = exports.getUserJettonWalletAddress = void 0;
const ton_access_1 = require("@orbs-network/ton-access");
const ton_1 = require("@ton/ton");
const apiBaseUrl = "https://testnet.toncenter.com/api/v2";
const usdtTokenContractAddress = "kQDIcEbTNyMX6YhiIqCBxyM0ODnRR2CEtQFLFp1gqNFEG8q-";
async function getUserJettonWalletAddress(userAddress, jettonMasterAddress) {
    const endpoint = await (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
    const client = new ton_1.TonClient({
        endpoint,
    });
    const userAddressCell = (0, ton_1.beginCell)()
        .storeAddress(ton_1.Address.parse(userAddress))
        .endCell();
    const response = await client.runMethod(ton_1.Address.parse(jettonMasterAddress), "get_wallet_address", [{ type: "slice", cell: userAddressCell }]);
    const jettonAddress = response.stack.readAddress();
    console.log(jettonAddress);
    return jettonAddress;
}
exports.getUserJettonWalletAddress = getUserJettonWalletAddress;
function parseTransferMessage(body) {
    const slice = body.beginParse();
    const op = slice.loadUint(32);
    const queryId = slice.loadUintBig(64);
    const amount = slice.loadCoins();
    const destination = slice.loadAddress();
    const payload = slice.remainingRefs > 0 ? slice.loadRef() : null;
    let msg = null;
    if (payload) {
        const fs = payload.beginParse();
        const fsop = fs.loadUint(32);
        if (fsop !== 0)
            throw new Error("Invalid opcode");
        msg = fs.loadStringTail();
    }
    return [op, queryId, amount, destination, msg];
}
async function detectJettonTransfer(walletAddress, jettonMasterAddress) {
    const endpoint = await (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
    const client = new ton_1.TonClient({
        endpoint,
    });
    const jettonWalletAddress = await getUserJettonWalletAddress(walletAddress, jettonMasterAddress);
    console.log("jettonWalletAddress>>", jettonWalletAddress.toString({
        urlSafe: true,
        bounceable: false,
        testOnly: true,
    }));
    let ttt = false;
    let transactions;
    while (!ttt) {
        try {
            transactions = await client.getTransactions(jettonWalletAddress, {
                limit: 100,
            });
            ttt = true;
        }
        catch (e) {
            console.log("failed");
        }
    }
    for (const tx of transactions) {
        if (tx.inMessage && tx.inMessage.body) {
            const [op, queryId, amount, destination, msg] = parseTransferMessage(tx.inMessage.body);
            if (op === 0x178d4519) {
                console.log("tx.inMessage.info.type", tx.inMessage.info.type);
                console.log(`Jetton transfer detected:`);
                console.log(`tx: ${tx.hash().toString("base64")}`);
                console.log(`tx: ${tx.hash().toString("hex")}`);
                console.log(`lt: ${tx.lt}`);
                console.log(`msg: ${msg}`);
                console.log(`Amount: ${amount}`);
                console.log(`Destination: ${destination.toString({
                    urlSafe: true,
                    bounceable: false,
                    testOnly: true,
                })}`);
                console.log(`Sender: ${tx.inMessage.info.src.toString({
                    urlSafe: true,
                    bounceable: false,
                    testOnly: true,
                })}\n\n`);
            }
        }
    }
}
exports.detectJettonTransfer = detectJettonTransfer;
//# sourceMappingURL=jetton-watch.js.map