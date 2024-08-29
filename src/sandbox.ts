import { TonClient4, Address } from "@ton/ton";
import { processTxsForever } from "./work/ton/ton";
import { parseForCMP, parseForPDMP } from "./work/uptn-asset";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { tonTransfer } from "./work/ton/ton-transfer";
import { detectJettonTransfer } from "./work/ton/jetton-watch";
import { detectTonTransfer } from "./work/ton/ton-watch";

const sandbox = async () => {
  // await parseForPDMP();
  // await parseForCMP();

  // await tonTransfer();
  // await transferTest();
  // await detectJettonTransfer(
  //   "0QD73AorUz_mGO4TEy8rfhBXVGiMiuFS9NYYk5EHK_cepFnC",
  //   "kQDIcEbTNyMX6YhiIqCBxyM0ODnRR2CEtQFLFp1gqNFEG8q-"
  // );

  await detectTonTransfer("0QD73AorUz_mGO4TEy8rfhBXVGiMiuFS9NYYk5EHK_cepFnC");
};

sandbox();
