import {
  Address,
  Cell,
  TonClient4,
  TonClient,
  WalletContractV5R1,
  Transaction,
  JettonMaster,
  JettonWallet,
} from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";
import { toNano, OpenedContract, beginCell, internal } from "@ton/core";
import { JettonMinter } from "./JettonMinter";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import TonWeb from "tonweb";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function tonTransfer(): Promise<void> {
  try {
    // open wallet v4 (notice the correct wallet version here)
    const mnemonic =
      "square gasp bonus pole join ivory memory sort empower carpet system mammal purse organ immune result copy unit section blast equal evidence goddess scrub"; // your 24 secret words (replace ... with the rest of the words)
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    console.log("publicKey >>", Buffer.from(key.publicKey).toString("base64"));
    const wallet = WalletContractV5R1.create({
      publicKey: key.publicKey,
      workchain: 0,
    });

    // initialize ton rpc client on testnet
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    console.log("wallet.address >>", wallet.address);
    // make sure wallet is deployed
    if (!(await client.isContractDeployed(wallet.address))) {
      return console.log("wallet is not deployed");
    }

    // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();
    await walletContract.sendTransfer({
      secretKey: key.secretKey,
      seqno: seqno,
      messages: [
        internal({
          to: "0QD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjZQf",
          value: "0.05", // 0.05 TON
          body: "Hello", // optional comment
          bounce: false,
        }),
      ],
      sendMode: 0,
    });

    // wait until confirmed
    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
      console.log("waiting for transaction to confirm...");
      await sleep(1500);
      currentSeqno = await walletContract.getSeqno();
    }
    console.log("transaction confirmed!");
  } catch (e) {
    console.log(e);
  }
}
