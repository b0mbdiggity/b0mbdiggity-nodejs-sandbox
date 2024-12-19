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
import * as bcrypt from "bcrypt";
import { presignedTest } from "./work/s3/presigned";
// import { genPayload, verify } from "./work/ton/verify";

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

  // await presignedTest();

  // await genPayload();
  // await verify();
  const fs = require("fs");
  let [conditions, cards] = fs.readFileSync("what", "utf-8").trim().split("\n");

  conditions = conditions.split(" ").map(Number);
  cards = cards.split(" ").map(Number);

  const target = conditions[1];
  let current;

  cards.sort((a, b) => a - b);

  for (let i = 0; i < cards.length - 2; i++) {
    let left = i + 1;
    let right = cards.length - 1;

    while (left !== right) {
      const sum = cards[i] + cards[left] + cards[right];
      if (sum > target) {
        right--;
      } else {
        left++;
      }

      if (!current || (target >= sum && current < sum)) {
        current = sum;
      }
    }
  }

  console.log(current);
};

sandbox();
