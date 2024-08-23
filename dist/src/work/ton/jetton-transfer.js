"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jetton = void 0;
const crypto_1 = require("@ton/crypto");
const ton_access_1 = require("@orbs-network/ton-access");
const tonweb_1 = __importDefault(require("tonweb"));
const { JettonMinter, JettonWallet } = tonweb_1.default.token.jetton;
const jetton = async () => {
    const endpoint = await (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
    const tonweb = new tonweb_1.default(new tonweb_1.default.HttpProvider(endpoint));
    const seed = tonweb_1.default.utils.base64ToBytes("vt58J2v6FaSuXFGcyGtqT5elpVxcZ+I1zgu/GUfA5uY=");
    const seed2 = tonweb_1.default.utils.base64ToBytes("at58J2v6FaSuXFGcyGtqT5elpVxcZ+I1zgu/GUfA5uY=");
    const WALLET2_ADDRESS = "0QD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjZQf";
    const mnemonic = "square gasp bonus pole join ivory memory sort empower carpet system mammal purse organ immune result copy unit section blast equal evidence goddess scrub";
    const key = await (0, crypto_1.mnemonicToWalletKey)(mnemonic.split(" "));
    const WalletClass = tonweb.wallet.all["v4R2"];
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: key.publicKey,
        wc: 0,
    });
    const walletAddress = await wallet.getAddress();
    console.log("wallet address=", walletAddress.toString(true, true, false, true));
    console.log("balance=", await tonweb.getBalance(await wallet.getAddress()));
    const minter = new JettonMinter(tonweb.provider, {
        adminAddress: walletAddress,
        jettonContentUri: "https://ton.org/jetton.json",
        jettonWalletCodeHex: JettonWallet.codeHex,
    });
    const minterAddress = await minter.getAddress();
    console.log("minter address=", minterAddress.toString(true, true, true, true));
    const JETTON_WALLET_ADDRESS = "kQAKMCPKF4QkB7p-zpL14nYhOjXwbAewH1axYUtAaWIwI67q";
    const jettonWallet = new JettonWallet(tonweb.provider, {
        address: JETTON_WALLET_ADDRESS,
    });
    const deployMinter = async () => {
        const seqno = (await wallet.methods.seqno().call()) || 0;
        console.log({ seqno });
        console.log(await wallet.methods
            .transfer({
            secretKey: key.secretKey,
            toAddress: minterAddress.toString(true, true, true),
            amount: tonweb_1.default.utils.toNano("0.05"),
            seqno: seqno,
            payload: null,
            sendMode: 3,
            stateInit: (await minter.createStateInit()).stateInit,
        })
            .send());
    };
    const getMinterInfo = async () => {
        const data = await minter.getJettonData();
        const temp = {};
        temp.totalSupply = data.totalSupply.toString();
        temp.adminAddress = data.adminAddress.toString(true, true, true);
        console.log(temp);
        const jettonWalletAddress = await minter.getJettonWalletAddress(walletAddress);
        console.log("getJettonWalletAddress=", jettonWalletAddress.toString(true, true, true, true));
    };
    const getJettonWalletInfo = async () => {
        const data = await jettonWallet.getData();
        const temp = {};
        temp.balance = data.balance.toString();
        temp.ownerAddress = data.ownerAddress.toString(true, true, true, true);
        temp.jettonMinterAddress = data.jettonMinterAddress.toString(true, true, true, true);
        console.log(temp);
    };
    const mint = async () => {
        const seqno = (await wallet.methods.seqno().call()) || 0;
        console.log({ seqno });
        console.log(await wallet.methods
            .transfer({
            secretKey: key.secretKey,
            toAddress: minterAddress.toString(true, true, true, true),
            amount: tonweb_1.default.utils.toNano("0.05"),
            seqno: seqno,
            payload: minter.createMintBody({
                jettonAmount: tonweb_1.default.utils.toNano("1000000"),
                destination: walletAddress,
                amount: tonweb_1.default.utils.toNano("0.05"),
            }),
            sendMode: 3,
        })
            .send());
    };
    const transfer = async () => {
        const seqno = (await wallet.methods.seqno().call()) || 0;
        console.log({ seqno });
        const comment = new Uint8Array([
            ...new Uint8Array(4),
            ...new TextEncoder().encode("gift"),
        ]);
        console.log(await wallet.methods
            .transfer({
            secretKey: key.secretKey,
            toAddress: JETTON_WALLET_ADDRESS,
            amount: tonweb_1.default.utils.toNano("0.05"),
            seqno: seqno,
            payload: await jettonWallet.createTransferBody({
                jettonAmount: tonweb_1.default.utils.toNano("500"),
                toAddress: new tonweb_1.default.utils.Address(WALLET2_ADDRESS),
                forwardAmount: tonweb_1.default.utils.toNano("0.01"),
                forwardPayload: comment,
                responseAddress: walletAddress,
            }),
            sendMode: 3,
        })
            .send());
    };
    const burn = async () => {
        const seqno = (await wallet.methods.seqno().call()) || 0;
        console.log({ seqno });
        console.log(await wallet.methods
            .transfer({
            secretKey: key.secretKey,
            toAddress: JETTON_WALLET_ADDRESS,
            amount: tonweb_1.default.utils.toNano("0.05"),
            seqno: seqno,
            payload: await jettonWallet.createBurnBody({
                tokenAmount: tonweb_1.default.utils.toNano("400"),
                responseAddress: walletAddress,
            }),
            sendMode: 3,
        })
            .send());
    };
    const promises = [transfer(), transfer(), transfer()];
    const results = await Promise.all(promises);
    console.log(results);
};
exports.jetton = jetton;
//# sourceMappingURL=jetton-transfer.js.map