import { mnemonicToWalletKey, mnemonicToHDSeed } from "@ton/crypto";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import TonWeb from "tonweb";

const { JettonMinter, JettonWallet } = TonWeb.token.jetton;

// import { Address, TonClient } from '@ton/ton';
// import { JettonMinter as JetMinter } from "./JettonMinter";

export const jetton = async () => {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));

  const seed = TonWeb.utils.base64ToBytes(
    "vt58J2v6FaSuXFGcyGtqT5elpVxcZ+I1zgu/GUfA5uY="
  );
  const seed2 = TonWeb.utils.base64ToBytes(
    "at58J2v6FaSuXFGcyGtqT5elpVxcZ+I1zgu/GUfA5uY="
  );
  const WALLET2_ADDRESS = "0QD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjZQf";

  const mnemonic =
    "square gasp bonus pole join ivory memory sort empower carpet system mammal purse organ immune result copy unit section blast equal evidence goddess scrub";
  const key = await mnemonicToWalletKey(mnemonic.split(" "));

  const WalletClass = tonweb.wallet.all["v4R2"];

  const wallet = new WalletClass(tonweb.provider, {
    publicKey: key.publicKey,
    wc: 0,
  });
  const walletAddress = await wallet.getAddress();

  console.log(
    "wallet address=",
    walletAddress.toString(true, true, false, true)
  );

  console.log("balance=", await tonweb.getBalance(await wallet.getAddress()));

  const minter = new JettonMinter(tonweb.provider, {
    adminAddress: walletAddress,
    jettonContentUri: "https://ton.org/jetton.json",
    jettonWalletCodeHex: JettonWallet.codeHex,
  });
  const minterAddress = await minter.getAddress();
  console.log(
    "minter address=",
    minterAddress.toString(true, true, true, true)
  );

  const JETTON_WALLET_ADDRESS =
    "kQAKMCPKF4QkB7p-zpL14nYhOjXwbAewH1axYUtAaWIwI67q";

  const jettonWallet = new JettonWallet(tonweb.provider, {
    address: JETTON_WALLET_ADDRESS,
  });

  const deployMinter = async () => {
    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log({ seqno });

    console.log(
      await wallet.methods
        .transfer({
          secretKey: key.secretKey,
          toAddress: minterAddress.toString(true, true, true),
          amount: TonWeb.utils.toNano("0.05"),
          seqno: seqno,
          payload: null, // body
          sendMode: 3,
          stateInit: (await minter.createStateInit()).stateInit,
        })
        .send()
    );
  };

  const getMinterInfo = async () => {
    const data = await minter.getJettonData();
    const temp: any = {};
    temp.totalSupply = data.totalSupply.toString();
    temp.adminAddress = data.adminAddress.toString(true, true, true);
    console.log(temp);

    const jettonWalletAddress = await minter.getJettonWalletAddress(
      walletAddress
    );
    console.log(
      "getJettonWalletAddress=",
      jettonWalletAddress.toString(true, true, true, true)
    );
  };

  const getJettonWalletInfo = async () => {
    const data = await jettonWallet.getData();
    const temp: any = {};
    temp.balance = data.balance.toString();
    temp.ownerAddress = data.ownerAddress.toString(true, true, true, true);
    temp.jettonMinterAddress = data.jettonMinterAddress.toString(
      true,
      true,
      true,
      true
    );
    console.log(temp);
  };

  const mint = async () => {
    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log({ seqno });

    console.log(
      await wallet.methods
        .transfer({
          secretKey: key.secretKey,
          toAddress: minterAddress.toString(true, true, true, true),
          amount: TonWeb.utils.toNano("0.05"),
          seqno: seqno,
          payload: minter.createMintBody({
            jettonAmount: TonWeb.utils.toNano("1000000"),
            destination: walletAddress,
            amount: TonWeb.utils.toNano("0.05"),
          } as any),
          sendMode: 3,
        })
        .send()
    );
  };

  // const mintTest = async () => {
  //   const seqno = (await wallet.methods.seqno().call()) || 0;
  //   console.log({ seqno });

  //   const jettonMaster = JetMinter.createFromAddress(
  //     Address.parse(minterAddress.toString(true, true, true, true))
  //   );
  //   const client = new TonClient({ endpoint });
  //   const contract = client.open(jettonMaster);

  //   const result = await contract.sendMint(
  //     client.provider(Address.parse(walletAddress.toString(true, true, true, true))).,
  //     Address.parse(minterAddress.toString(true, true, true, true)),
  //     TonWeb.utils.toNano("10"),
  //     TonWeb.utils.toNano("0.05"),
  //     TonWeb.utils.toNano("0.1")
  //   );
  // };

  const transfer = async () => {
    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log({ seqno });
    // first four zero bytes are tag of text comment
    const comment = new Uint8Array([
      ...new Uint8Array(4),
      ...new TextEncoder().encode("gift"),
    ]);
    console.log(
      await wallet.methods
        .transfer({
          secretKey: key.secretKey,
          toAddress: JETTON_WALLET_ADDRESS,
          amount: TonWeb.utils.toNano("0.05"),
          seqno: seqno,
          payload: await jettonWallet.createTransferBody({
            jettonAmount: TonWeb.utils.toNano("500"),
            toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS),
            forwardAmount: TonWeb.utils.toNano("0.01"),
            forwardPayload: comment,
            responseAddress: walletAddress,
          } as any),
          sendMode: 3,
        })
        .send()
    );
  };

  const burn = async () => {
    const seqno = (await wallet.methods.seqno().call()) || 0;
    console.log({ seqno });

    console.log(
      await wallet.methods
        .transfer({
          secretKey: key.secretKey,
          toAddress: JETTON_WALLET_ADDRESS,
          amount: TonWeb.utils.toNano("0.05"),
          seqno: seqno,
          payload: await jettonWallet.createBurnBody({
            tokenAmount: TonWeb.utils.toNano("400"),
            responseAddress: walletAddress,
          }),
          sendMode: 3,
        })
        .send()
    );
  };

  // await deployMinter();
  // await getMinterInfo();
  // await mint();
  // await getJettonWalletInfo();
  // await editContent();
  // await changeAdmin();
  const promises = [transfer(), transfer(), transfer()];
  const results = await Promise.all(promises);
  console.log(results);
  // await transfer();
  // await burn();
};
