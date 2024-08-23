import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import {
  beginCell,
  Address,
  TonClient,
  WalletContractV4,
  internal,
  external,
  storeMessage,
  toNano,
} from "@ton/ton";

const usdtTokenContractAddress =
  "kQDIcEbTNyMX6YhiIqCBxyM0ODnRR2CEtQFLFp1gqNFEG8q-";
const toAddress = Address.parse(
  "0QD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjZQf"
);

async function getUserJettonWalletAddress(
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

export const transferTest = async () => {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({
    endpoint,
  });

  // Generate keyPair from mnemonic/secret key
  const mnemonic =
    "square gasp bonus pole join ivory memory sort empower carpet system mammal purse organ immune result copy unit section blast equal evidence goddess scrub";
  const keyPair = await mnemonicToWalletKey(mnemonic.split(" "));
  const secretKey = Buffer.from(keyPair.secretKey);
  const publicKey = Buffer.from(keyPair.publicKey);

  const workchain = 0; // Usually you need a workchain 0
  const wallet = WalletContractV4.create({ workchain, publicKey });
  const address = wallet.address.toString({
    urlSafe: true,
    bounceable: false,
    testOnly: false,
  });
  const contract = client.open(wallet);

  const balance = await contract.getBalance();
  console.log({ address, balance });

  const seqno = await contract.getSeqno();
  console.log({ address, seqno });

  const { init } = contract;
  const contractDeployed = await client.isContractDeployed(
    Address.parse(address)
  );
  let neededInit: null | typeof init = null;

  if (init && !contractDeployed) {
    neededInit = init;
  }

  const jettonWalletAddress = await getUserJettonWalletAddress(
    address,
    usdtTokenContractAddress
  );

  // Comment payload
  // const forwardPayload = beginCell()
  //   .storeUint(0, 32) // 0 opcode means we have a comment
  //   .storeStringTail('Hello, TON!')
  //   .endCell();

  const messageBody = beginCell()
    .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer
    .storeUint(0, 64) // query id
    .storeCoins(toNano("1")) // jetton amount, amount * 10^9
    .storeAddress(toAddress)
    .storeAddress(toAddress) // response destination
    .storeBit(0) // no custom payload
    .storeCoins(0) // forward amount - if > 0, will send notification message
    .storeBit(0) // we store forwardPayload as a reference, set 1 and uncomment next line for have a comment
    // .storeRef(forwardPayload)
    .endCell();

  const internalMessage = internal({
    to: jettonWalletAddress,
    value: toNano("0.1"),
    bounce: true,
    body: messageBody,
  });

  const body = wallet.createTransfer({
    seqno,
    secretKey,
    messages: [internalMessage],
  });

  const externalMessage = external({
    to: address,
    init: neededInit,
    body,
  });

  const externalMessageCell = beginCell()
    .store(storeMessage(externalMessage))
    .endCell();

  const signedTransaction = externalMessageCell.toBoc();
  const hash = externalMessageCell.hash().toString("hex");

  console.log("hash:", hash);

  await client.sendFile(signedTransaction);
};
