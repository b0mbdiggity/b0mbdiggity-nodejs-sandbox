import { TonClient4, Address } from "@ton/ton";
import { processTxsForever } from "./work/ton/ton";
import { parseForCMP, parseForPDMP } from "./work/uptn-asset";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { tonTransfer } from "./work/ton/ton-transfer";
import {
  detectJettonTransfer,
  getUserJettonWalletAddress,
} from "./work/ton/jetton-watch";
import { detectTonTransfer } from "./work/ton/ton-watch";
import { transferTest } from "./work/ton/jetton-transfer";
import { isNumber } from "class-validator";
import crypto from "crypto";

const sandbox = async () => {
  // await parseForPDMP();
  // await parseForCMP();

  // await tonTransfer();
  // await transferTest();
  // await detectJettonTransfer(
  //   "0QBgWJPWh0E5rlz4ygIqa2OtlZTOcE3UctNW2xvmUO4JCgAq",
  //   "kQDIcEbTNyMX6YhiIqCBxyM0ODnRR2CEtQFLFp1gqNFEG8q-"
  // );

  // await getUserJettonWalletAddress(
  //   "0QBgWJPWh0E5rlz4ygIqa2OtlZTOcE3UctNW2xvmUO4JCgAq",
  //   "kQDIcEbTNyMX6YhiIqCBxyM0ODnRR2CEtQFLFp1gqNFEG8q-"
  // );

  // await detectTonTransfer("0QBgWJPWh0E5rlz4ygIqa2OtlZTOcE3UctNW2xvmUO4JCgAq");

  const iv = crypto.randomBytes(16);
  console.log(iv);
};

sandbox();
