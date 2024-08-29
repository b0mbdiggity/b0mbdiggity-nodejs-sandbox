import { TonClient4, Address } from "@ton/ton";
import { processTxsForever } from "./work/ton/ton";
import { parseForCMP, parseForPDMP } from "./work/uptn-asset";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { tonTransfer } from "./work/ton/ton-transfer";
import {
  getUserJettonWalletAddress,
  transferTest,
} from "./work/ton/jetton-transfer-ton";
import { detectJettonTransfer } from "./work/ton/ton-web-watch";

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
  // await transferTest();
  await detectJettonTransfer(
    "0QD73AorUz_mGO4TEy8rfhBXVGiMiuFS9NYYk5EHK_cepFnC",
    "kQDIcEbTNyMX6YhiIqCBxyM0ODnRR2CEtQFLFp1gqNFEG8q-"
  );
  // const jettonWalletAddress = await getUserJettonWalletAddress(
  //   Address.parse("0QD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjZQf").toString({
  //     urlSafe: true,
  //     bounceable: false,
  //     testOnly: true,
  //   }),
  //   "kQDIcEbTNyMX6YhiIqCBxyM0ODnRR2CEtQFLFp1gqNFEG8q-"
  // );

  // console.log("jettonWalletAddress", jettonWalletAddress);
};

sandbox();
