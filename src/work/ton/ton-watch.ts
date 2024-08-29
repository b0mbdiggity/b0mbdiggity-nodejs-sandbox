import TonWeb from "tonweb";
import axios from "axios";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { Address, beginCell, Cell, TonClient } from "@ton/ton";

// TON 코인 전송 감지 함수
export async function detectTonTransfer(walletAddress: string) {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  const address = Address.parse(walletAddress);

  const transactions = await client.getTransactions(address, {
    limit: 100,
  });

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
          } catch (error) {
            console.log("what!!!!", error);
          }
        }
      }

      console.log(`TON transfer detected:`);
      console.log(`Transaction Hash: ${tx.hash().toString("base64")}`);
      console.log(`Transaction Hash (Hex): ${tx.hash().toString("hex")}`);
      console.log(`Logical Time: ${tx.lt}`);
      console.log(`Amount: ${amount} nanoTON`);
      console.log(
        `Sender: ${sender.toString({
          urlSafe: true,
          bounceable: false,
          testOnly: true,
        })}`
      );
      console.log(`Comment: ${comment || "No comment"}\n\n`);
    }
  }
}
