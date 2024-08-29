import TonWeb from "tonweb";
import axios from "axios";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { Address, beginCell, Cell, TonClient } from "@ton/ton";

const apiBaseUrl = "https://testnet.toncenter.com/api/v2";

const usdtTokenContractAddress =
  "kQDIcEbTNyMX6YhiIqCBxyM0ODnRR2CEtQFLFp1gqNFEG8q-";

// Jetton 월렛 주소 계산 함수
export async function getUserJettonWalletAddress(
  userAddress: string,
  jettonMasterAddress: string
) {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({
    endpoint,
  });

  const userAddressCell = beginCell()
    .storeAddress(Address.parse(userAddress))
    .endCell();

  const response = await client.runMethod(
    Address.parse(jettonMasterAddress),
    "get_wallet_address",
    [{ type: "slice", cell: userAddressCell }]
  );

  return response.stack.readAddress();
}

// 전송 메시지 파싱 함수
function parseTransferMessage(
  body: Cell
): [number, bigint, bigint, Address, string | null] {
  const slice = body.beginParse();
  const op = slice.loadUint(32);
  const queryId = slice.loadUintBig(64);
  const amount = slice.loadCoins();
  const destination = slice.loadAddress();
  const payload = slice.remainingRefs > 0 ? slice.loadRef() : null;

  let msg: string | null = null;
  if (payload) {
    const fs = payload.beginParse();
    const fsop = fs.loadUint(32);
    if (fsop !== 0) throw new Error("Invalid opcode");
    msg = fs.loadStringTail();
  }

  return [op, queryId, amount, destination, msg];
}

export async function detectJettonTransfer(
  walletAddress: string,
  jettonMasterAddress: string
) {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({
    endpoint,
  });

  // Jetton 월렛 주소 계산
  const jettonWalletAddress = await getUserJettonWalletAddress(
    walletAddress,
    jettonMasterAddress
  );

  const transactions = await client.getTransactions(jettonWalletAddress, {
    limit: 100,
    // hash: "BH9PJ6D3OvGpwPSqWtH4Bnc0Z6gevNvqEcanlIZMDug=",
    // lt: "25299474000001",
    // hash: "W9k9mwMrBLVbu+S1ZjHBFVO4yHUaTcz1OqD71gOyhFQ=",
    // lt: "25261905000001",
  });

  for (const tx of transactions) {
    if (tx.inMessage && tx.inMessage.body) {
      const [op, queryId, amount, destination, msg] = parseTransferMessage(
        tx.inMessage.body
      );

      if (op === 0x178d4519) {
        // 보낸건 Jetton Transfer 0x0f8a7ea5 오퍼레이션으로 필터링 하면 됨
        // 받은건 Jetton Internal Transfer 오퍼레이션으로 필터링 하면 됨
        console.log(`Jetton transfer detected:`);
        console.log(`tx: ${tx.hash().toString("base64")}`);
        console.log(`tx: ${tx.hash().toString("hex")}`);
        console.log(`lt: ${tx.lt}`);
        console.log(`msg: ${msg}`);
        console.log(`Amount: ${amount}`);
        console.log(
          `Destination: ${destination.toString({
            urlSafe: true,
            bounceable: false,
            testOnly: true,
          })}`
        );
        console.log(
          `Sender: ${tx.inMessage.info.src.toString({
            urlSafe: true,
            bounceable: false,
            testOnly: true,
          })}\n\n`
        );
      }
    }
  }
}
