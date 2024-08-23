import { Address, SendMode, internal, toNano, comment } from "@ton/core";

import { mnemonicToWalletKey, mnemonicToHDSeed } from "@ton/crypto";
import { getHttpEndpoint } from "@orbs-network/ton-access";
// import TonWeb from "tonweb";

// const { JettonMinter, JettonWallet } = TonWeb.token.jetton;

import { TonClient, JettonMaster, JettonWallet } from "@ton/ton";

import { HighloadWalletV3 } from "@tonkite/highload-wallet-v3";

// import { Address, TonClient } from '@ton/ton';
// import { JettonMinter as JetMinter } from "./JettonMinter";

export const batch = async () => {
  // const endpoint = await getHttpEndpoint({ network: "testnet" });
  // const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  // const seed = TonWeb.utils.base64ToBytes(
  //   "vt58J2v6FaSuXFGcyGtqT5elpVxcZ+I1zgu/GUfA5uY="
  // );
  // const seed2 = TonWeb.utils.base64ToBytes(
  //   "at58J2v6FaSuXFGcyGtqT5elpVxcZ+I1zgu/GUfA5uY="
  // );
  // const WALLET2_ADDRESS = "0QD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjZQf";

  // const mnemonic =
  //   "square gasp bonus pole join ivory memory sort empower carpet system mammal purse organ immune result copy unit section blast equal evidence goddess scrub"; // your 24 secret words (replace ... with the rest of the words)
  // const key = await mnemonicToWalletKey(mnemonic.split(" "));

  // const WalletClass = tonweb.wallet.all["v4R2"];

  // const wallet = new WalletClass(tonweb.provider, {
  //   publicKey: key.publicKey,
  //   wc: 0,
  // });
  // const walletAddress = await wallet.getAddress();

  // console.log(
  //   "wallet address=",
  //   walletAddress.toString(true, true, false, true)
  // );

  // console.log("balance=", await tonweb.getBalance(await wallet.getAddress()));

  // const minter = new JettonMinter(tonweb.provider, {
  //   adminAddress: walletAddress,
  //   jettonContentUri: "https://ton.org/jetton.json",
  //   jettonWalletCodeHex: JettonWallet.codeHex,
  // });
  // const minterAddress = await minter.getAddress();
  // console.log(
  //   "minter address=",
  //   minterAddress.toString(true, true, true, true)
  // );

  // const JETTON_WALLET_ADDRESS =
  //   "kQAKMCPKF4QkB7p-zpL14nYhOjXwbAewH1axYUtAaWIwI67q";

  // const jettonWallet = new JettonWallet(tonweb.provider, {
  //   address: JETTON_WALLET_ADDRESS,
  // });

  const transfer = async () => {
    const mnemonic =
      "square gasp bonus pole join ivory memory sort empower carpet system mammal purse organ immune result copy unit section blast equal evidence goddess scrub"; // your 24 secret words (replace ... with the rest of the words)
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    // const tonClient = new TonClient({ endpoint });
    const tonClient = new TonClient({
      endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
      apiKey:
        "064ea76e4dc0d0f65d6939b5d801c861446ca6b2b57bf243d8044b83d8ce7d9b",
    });

    const queryIdSequence = HighloadWalletV3.newSequence(); // or `HighloadWalletV3.restoreSequence(xxx)`
    const wallet = tonClient.open(
      new HighloadWalletV3(queryIdSequence, key.publicKey)
    );

    await wallet.sendBatch(key.secretKey, {
      messages: [
        {
          mode: SendMode.NONE,
          message: internal({
            to: Address.parse(
              "0QD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjZQf"
            ),
            value: toNano("0.005"),
            body: comment("Hello Tonkite!"),
            bounce: false,
          }),
        },
        {
          mode: SendMode.NONE,
          message: internal({
            to: Address.parse(
              "0QD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjZQf"
            ),
            value: toNano("0.005"),
            body: comment("Hello Tonkite!"),
          }),
        },
      ],

      /*
       * NOTE: This it subtotal for all messages + fees.
       *       This value can be omitted, but it's recommended to specify it.
       *       Otherwise, batches will be sent in different blocks (e.a. time-consuming).
       */
      valuePerBatch: toNano("0.015"),

      /*
       * NOTE: Time-shift because time may be out of sync.
       *       The contract accepts older messages, but not those ahead of time.
       */
      createdAt: Math.floor(Date.now() / 1000) - 60,
    });
  };

  await transfer();
};
