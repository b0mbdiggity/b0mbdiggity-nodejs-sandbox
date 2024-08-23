import { TonClient4, Address } from "@ton/ton";
import { processTxsForever } from "./work/ton/ton";
import { parseForCMP, parseForPDMP } from "./work/uptn-asset";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { tonTransfer } from "./work/ton/ton-transfer";
import { jetton } from "./work/ton/jetton-transfer";
import { batch } from "./work/ton/highload";
import { transferTest } from "./work/ton/jetton-transfer-ton";

const sandbox = async () => {
  // await parseForPDMP();
  // await parseForCMP();

  // const client = new TonClient4({
  //   endpoint: await getHttpV4Endpoint({ network: "testnet" }),
  // });

  // await processTxsForever(
  //   Address.parse("EQDKTJazktT0_U-yBYECvj1__0r-_46mvQjxBcWvfoAebzlf"),
  //   // Address.parse("EQC_hOWH6nofwehTdADY8efs_zplcnE-0fqMbmQ2GNKBI-Zc"),
  //   client,
  //   undefined
  // );

  // await tonTransfer();
  // await batch();
  await transferTest();
};

sandbox();
