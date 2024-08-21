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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function tonTransfer(): Promise<void> {
  try {
    // open wallet v4 (notice the correct wallet version here)
    const mnemonic = ""; // your 24 secret words (replace ... with the rest of the words)
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

export async function jettonTransfer(): Promise<void> {
  try {
    // 지갑 초기화
    const mnemonic =
      "square gasp bonus pole join ivory memory sort empower carpet system mammal purse organ immune result copy unit section blast equal evidence goddess scrub";
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV5R1.create({
      publicKey: key.publicKey,
      workchain: 0,
    });

    // TON 클라이언트 초기화
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    console.log("지갑 주소:", wallet.address.toString());
    if (!(await client.isContractDeployed(wallet.address))) {
      return console.log("지갑이 배포되지 않았습니다.");
    }

    // Jetton 마스터 컨트랙트 주소
    const jettonMasterAddress = Address.parse(
      "EQC_hOWH6nofwehTdADY8efs_zplcnE-0fqMbmQ2GNKBI-Zc"
    );
    const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress));

    // 발신자의 Jetton 지갑 주소 가져오기
    const senderJettonWalletAddress = await jettonMaster.getWalletAddress(
      wallet.address
    );
    const senderJettonWallet = client.open(
      JettonWallet.create(senderJettonWalletAddress)
    );

    // 수신자 주소
    const receiverAddress = Address.parse(
      "EQD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjXJQ"
    );

    // Jetton 전송 메시지 생성
    const jettonAmount = toNano("10"); // 10 Jetton 전송 (실제 금액으로 조정 필요)
    const forwardAmount = toNano("0.01"); // 전달할 TON 금액
    const transferMessage = beginCell()
      .storeUint(0xf8a7ea5, 32) // op code for jetton transfer
      .storeUint(0, 64) // query id
      .storeCoins(jettonAmount)
      .storeAddress(receiverAddress)
      .storeAddress(wallet.address) // response destination
      .storeCoins(forwardAmount)
      .storeBit(false) // no custom payload
      .endCell();

    // 트랜잭션 전송
    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();
    await walletContract.sendTransfer({
      secretKey: key.secretKey,
      seqno: seqno,
      messages: [
        internal({
          to: senderJettonWalletAddress,
          value: toNano("0.05"), // 가스 비용
          body: transferMessage,
        }),
      ],
      sendMode: 0,
    });

    // 트랜잭션 확인 대기
    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
      console.log("트랜잭션 확인 대기 중...");
      await sleep(1500);
      currentSeqno = await walletContract.getSeqno();
    }
    console.log("Jetton 전송 완료!");
  } catch (e) {
    console.error("Jetton 전송 중 오류 발생:", e);
  }
}
