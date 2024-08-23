"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTxsForever = void 0;
const ton_1 = require("@ton/ton");
function sleep(timeout) {
    return new Promise((res) => {
        setTimeout(() => res(), timeout);
    });
}
async function processTxsForever(address, client, known) {
    while (true) {
        await sleep(5000);
        known = await processTxs(address, client, known);
    }
}
exports.processTxsForever = processTxsForever;
function parseTransferNotification(cell) {
    const s = cell.beginParse();
    const opcode = s.loadUint(32);
    if (opcode === 0x7362d09c) {
        return {
            queryId: s.loadUintBig(64),
            amount: s.loadCoins(),
            sender: s.loadAddress(),
            forwardPayload: s.loadBoolean() ? s.loadRef() : s.asCell(),
        };
    }
    else if (opcode === 0x546de4ef) {
        return {
            queryId: s.loadUintBig(64),
            amount: s.loadCoins(),
            sender: ton_1.Address.parseRaw(s.loadBits(267).toString()),
            forwardPayload: s.loadBoolean() ? s.loadRef() : s.asCell(),
        };
    }
    else {
        console.log(`Unexpected opcode: 0x${opcode.toString(16)}`);
        throw new Error("Invalid opcode");
    }
    return {
        queryId: s.loadUintBig(64),
        amount: s.loadCoins(),
        sender: s.loadAddress(),
        forwardPayload: s.loadBoolean() ? s.loadRef() : s.asCell(),
    };
}
function parsePurchaseRequest(tx) {
    try {
        if (!tx.inMessage)
            throw new Error("No message");
        if (!(tx.inMessage.info.src instanceof ton_1.Address))
            throw new Error("Invalid sender");
        const parsed = parseTransferNotification(tx.inMessage.body);
        const fs = parsed.forwardPayload.beginParse();
        const op = fs.loadUint(32);
        if (op !== 0)
            throw new Error("Invalid opcode");
        const msg = fs.loadStringTail();
        const parts = msg.split(":");
        if (parts.length !== 2) {
            throw new Error("Invalid message");
        }
        return {
            userID: Number(parts[0]),
            itemID: Number(parts[1]),
            amount: parsed.amount,
            hash: tx.hash(),
            lt: tx.lt,
        };
    }
    catch (e) {
        console.log(e);
    }
    return undefined;
}
async function findPurchaseRequests(client, address, from, known) {
    const prs = [];
    let curHash = from.hash;
    let curLt = from.lt;
    let first = true;
    mainLoop: while (true) {
        const txs = await client.getAccountTransactions(address, curLt, curHash);
        console.log("txs>>", txs);
        if (first) {
            first = false;
        }
        else {
            txs.shift();
            if (txs.length === 0)
                break;
        }
        for (const tx of txs) {
            if (known !== undefined &&
                tx.tx.hash().equals(known.hash) &&
                tx.tx.lt === known.lt)
                break mainLoop;
            const pr = parsePurchaseRequest(tx.tx);
            console.log("pr>>", pr);
            if (pr !== undefined)
                prs.push(pr);
        }
        curHash = txs[txs.length - 1].tx.hash();
        curLt = txs[txs.length - 1].tx.lt;
    }
    return prs;
}
async function processTxs(address, client, known) {
    try {
        const lastBlock = await client.getLastBlock();
        const acc = await client.getAccountLite(lastBlock.last.seqno, address);
        if (acc.account.last === null)
            return undefined;
        if (known !== undefined &&
            acc.account.last.hash === known.hash.toString("base64") &&
            acc.account.last.lt === known.lt.toString())
            return known;
        const newKnown = {
            hash: Buffer.from(acc.account.last.hash, "base64"),
            lt: BigInt(acc.account.last.lt),
        };
        console.log("newKnown>>", newKnown);
        let purchaseRequests = await findPurchaseRequests(client, address, newKnown, known);
        const itemIDs = Array.from(new Set(purchaseRequests.map((p) => p.itemID)));
        console.log("result >>>", itemIDs);
        return newKnown;
    }
    catch (e) {
        return known;
    }
}
//# sourceMappingURL=ton.js.map