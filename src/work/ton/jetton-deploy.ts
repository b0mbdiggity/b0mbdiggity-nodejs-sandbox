import TonWeb from "tonweb";
import axios from "axios";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import {
  Address,
  beginCell,
  Cell,
  JettonMaster,
  TonClient,
  WalletContractV4,
  WalletContractV5R1,
} from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";

export async function deployJetton() {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({
    endpoint,
  });

  // Generate keyPair from mnemonic/secret key
  const mnemonic =
    "crash attitude rubber shop magic hockey visual embark inquiry monster aerobic warfare other hire account rally wealth glimpse music give actor frame off frost";
  const keyPair = await mnemonicToWalletKey(mnemonic.split(" "));

  const wallet = WalletContractV5R1.create({
    publicKey: keyPair.publicKey,
    workchain: 0,
  });
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();

  // Jetton 콘텐츠 설정
  const jettonContent = {
    name: "My Jetton",
    description: "This is my first Jetton on TON",
    symbol: "MJT",
    image: "https://example.com/jetton-image.png",
  };

  // Jetton Minter 컨트랙트 생성
  const jettonMinter = JettonMaster.create(wallet.address);

  // 배포 메시지 생성
  // const deployAmount = BigInt(0.05 * 1e9); // 0.05 TON
  // const deployMessage = internal({
  //   to: jettonMinter.address,
  //   value: deployAmount,
  //   body: jettonMinter.createStateInit(),
  // });

  // 배포 트랜잭션 전송
  // const seqno = await walletContract.getSeqno();
  // await walletContract.sendTransfer({
  //   seqno,
  //   secretKey: key.secretKey,
  //   messages: [deployMessage],
  // });

  console.log("Jetton Minter deployed at:", jettonMinter.address.toString());
}
