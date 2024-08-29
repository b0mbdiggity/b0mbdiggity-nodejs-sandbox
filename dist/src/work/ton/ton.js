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
    if (opcode === 0x178d4519) {
        console.log("opcode >>", opcode, cell);
        const parsed = {
            queryId: s.loadUintBig(64),
            amount: s.loadCoins(),
            sender: s.loadAddress(),
            forwardPayload: s.remainingRefs > 0 ? s.loadRef() : s.asCell(),
        };
        console.log("parsed>>", parsed);
        return parsed;
    }
    else {
        console.log(`Unexpected opcode: 0x${opcode.toString(16)}`);
        throw new Error("Invalid opcode");
    }
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
        if (parts.length !== 3) {
            throw new Error("Invalid message");
        }
        return {
            gameID: parts[0],
            userID: parts[1],
            itemID: parts[2],
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
        console.log("result >>>", purchaseRequests);
        return newKnown;
    }
    catch (e) {
        return known;
    }
}
//# sourceMappingURL=ton.js.map