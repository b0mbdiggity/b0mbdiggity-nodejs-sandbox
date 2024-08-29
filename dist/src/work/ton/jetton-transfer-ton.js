"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferTest = exports.getUserJettonWalletAddress = void 0;
const ton_access_1 = require("@orbs-network/ton-access");
const crypto_1 = require("@ton/crypto");
const ton_1 = require("@ton/ton");
const usdtTokenContractAddress = "kQDIcEbTNyMX6YhiIqCBxyM0ODnRR2CEtQFLFp1gqNFEG8q-";
const toAddress = ton_1.Address.parse("0QD73AorUz_mGO4TEy8rfhBXVGiMiuFS9NYYk5EHK_cepFnC");
async function getUserJettonWalletAddress(userAddress, jettonMasterAddress) {
    const endpoint = await (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
    const client = new ton_1.TonClient({
        endpoint,
    });
    const userAddressCell = (0, ton_1.beginCell)()
        .storeAddress(ton_1.Address.parse(userAddress))
        .endCell();
    const response = await client.runMethod(ton_1.Address.parse(jettonMasterAddress), "get_wallet_address", [{ type: "slice", cell: userAddressCell }]);
    return response.stack.readAddress();
}
exports.getUserJettonWalletAddress = getUserJettonWalletAddress;
const transferTest = async () => {
    const endpoint = await (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
    const client = new ton_1.TonClient({
        endpoint,
    });
    const mnemonic = "carpet evoke nominee movie admit steak have sweet bleak twist lamp possible kick amused neck ostrich tourist economy execute level hard steel safe card";
    const keyPair = await (0, crypto_1.mnemonicToWalletKey)(mnemonic.split(" "));
    const secretKey = Buffer.from(keyPair.secretKey);
    const publicKey = Buffer.from(keyPair.publicKey);
    const workchain = 0;
    const wallet = ton_1.WalletContractV5R1.create({ workchain, publicKey });
    const address = wallet.address.toString({
        urlSafe: true,
        bounceable: false,
        testOnly: true,
    });
    const contract = client.open(wallet);
    const balance = await contract.getBalance();
    console.log({ address, balance });
    const seqno = await contract.getSeqno();
    console.log({ address, seqno });
    const { init } = contract;
    const contractDeployed = await client.isContractDeployed(ton_1.Address.parse(address));
    let neededInit = null;
    if (init && !contractDeployed) {
        neededInit = init;
    }
    const jettonWalletAddress = await getUserJettonWalletAddress(address, usdtTokenContractAddress);
    const forwardPayload = (0, ton_1.beginCell)()
        .storeUint(0, 32)
        .storeStringTail("gameID11:userId22:itemId33")
        .endCell();
    const messageBody = (0, ton_1.beginCell)()
        .storeUint(0x0f8a7ea5, 32)
        .storeUint(0, 64)
        .storeCoins((0, ton_1.toNano)("1.2"))
        .storeAddress(toAddress)
        .storeAddress(toAddress)
        .storeBit(0)
        .storeCoins(0)
        .storeBit(1)
        .storeRef(forwardPayload)
        .endCell();
    const internalMessage = (0, ton_1.internal)({
        to: jettonWalletAddress,
        value: (0, ton_1.toNano)("0.1"),
        bounce: true,
        body: messageBody,
    });
    const body = wallet.createTransfer({
        seqno,
        secretKey,
        messages: [internalMessage],
        sendMode: ton_1.SendMode.NONE,
    });
    const externalMessage = (0, ton_1.external)({
        to: address,
        init: neededInit,
        body,
    });
    const externalMessageCell = (0, ton_1.beginCell)()
        .store((0, ton_1.storeMessage)(externalMessage))
        .endCell();
    const signedTransaction = externalMessageCell.toBoc();
    const hash = externalMessageCell.hash().toString("hex");
    console.log("hash:", hash);
    await client.sendFile(signedTransaction);
    console.log("Transaction sent. Waiting for confirmation...");
    const intervalId = setInterval(async () => {
        const seqNo2 = await contract.getSeqno();
        if (seqNo2 > seqno) {
            console.log("✅ Transaction confirmed!\n");
            clearInterval(intervalId);
        }
    }, 3000);
};
exports.transferTest = transferTest;
//# sourceMappingURL=jetton-transfer-ton.js.map