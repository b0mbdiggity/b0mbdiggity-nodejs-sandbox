import { getHttpEndpoint } from "@orbs-network/ton-access";
import {
  Address,
  Cell,
  JettonWallet,
  TonClient,
  TonClient4,
  Transaction,
} from "@ton/ton";

type PurchaseRequest = {
  gameID: string;
  userID: string;
  itemID: string;
  amount: bigint;
  hash: Buffer;
  lt: bigint;
};

function sleep(timeout: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(() => res(), timeout);
  });
}

export async function processTxsForever(
  address: Address,
  client: TonClient4,
  known?: { hash: Buffer; lt: bigint }
) {
  while (true) {
    await sleep(5000);
    known = await processTxs(address, client, known);
  }
}

function parseTransferNotification(cell: Cell): {
  queryId: bigint;
  amount: bigint;
  sender: Address;
  forwardPayload: Cell;
} {
  const s = cell.beginParse();
  const opcode = s.loadUint(32);
  if (opcode === 0x178d4519) {
    console.log("opcode >>", opcode, cell);
    // 내부 전송 알림
    const parsed = {
      queryId: s.loadUintBig(64),
      amount: s.loadCoins(),
      sender: s.loadAddress(),
      forwardPayload: s.remainingRefs > 0 ? s.loadRef() : s.asCell(),
    };

    console.log("parsed>>", parsed);
    return parsed;
  } else {
    console.log(`Unexpected opcode: 0x${opcode.toString(16)}`);
    throw new Error("Invalid opcode");
  }
}

function parsePurchaseRequest(tx: Transaction) {
  try {
    if (!tx.inMessage) throw new Error("No message");
    if (!(tx.inMessage.info.src instanceof Address))
      throw new Error("Invalid sender");

    const parsed = parseTransferNotification(tx.inMessage.body);
    const fs = parsed.forwardPayload.beginParse();
    const op = fs.loadUint(32);
    if (op !== 0) throw new Error("Invalid opcode");
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
  } catch (e) {
    console.log(e);
  }

  return undefined;
}

async function findPurchaseRequests(
  client: TonClient4,
  address: Address,
  from: { hash: Buffer; lt: bigint },
  known?: { hash: Buffer; lt: bigint }
): Promise<PurchaseRequest[]> {
  const prs: PurchaseRequest[] = [];
  let curHash = from.hash;
  let curLt = from.lt;
  let first = true;
  mainLoop: while (true) {
    const txs = await client.getAccountTransactions(address, curLt, curHash);
    // console.log("txs>>", txs);
    if (first) {
      first = false;
    } else {
      txs.shift();
      if (txs.length === 0) break;
    }
    for (const tx of txs) {
      if (
        known !== undefined &&
        tx.tx.hash().equals(known.hash) &&
        tx.tx.lt === known.lt
      )
        break mainLoop;
      const pr = parsePurchaseRequest(tx.tx);
      console.log("pr>>", pr);
      if (pr !== undefined) prs.push(pr);
    }
    curHash = txs[txs.length - 1].tx.hash();
    curLt = txs[txs.length - 1].tx.lt;
  }
  return prs;
}

async function processTxs(
  address: Address,
  client: TonClient4,
  known?: { hash: Buffer; lt: bigint }
): Promise<{ hash: Buffer; lt: bigint } | undefined> {
  try {
    const lastBlock = await client.getLastBlock();
    const acc = await client.getAccountLite(lastBlock.last.seqno, address);
    // console.log("lastBlock>>", lastBlock);
    // console.log("acc>>", acc);

    if (acc.account.last === null) return undefined;
    if (
      known !== undefined &&
      acc.account.last.hash === known.hash.toString("base64") &&
      acc.account.last.lt === known.lt.toString()
    )
      return known;
    const newKnown = {
      hash: Buffer.from(acc.account.last.hash, "base64"),
      lt: BigInt(acc.account.last.lt),
    };
    console.log("newKnown>>", newKnown);
    let purchaseRequests: {
      gameID: string;
      userID: string;
      itemID: string;
      amount: bigint;
      hash: Buffer;
      lt: bigint;
    }[] = await findPurchaseRequests(client, address, newKnown, known);
    // const itemIDs = Array.from(new Set(purchaseRequests.map((p) => p.itemID)));
    console.log("result >>>", purchaseRequests);
    return newKnown;
  } catch (e) {
    return known;
  }
}
