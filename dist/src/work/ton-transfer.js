"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jettonTransfer = exports.tonTransfer = void 0;
const ton_1 = require("@ton/ton");
const crypto_1 = require("@ton/crypto");
const core_1 = require("@ton/core");
const ton_access_1 = require("@orbs-network/ton-access");
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function tonTransfer() {
    try {
        const mnemonic = "square gasp bonus pole join ivory memory sort empower carpet system mammal purse organ immune result copy unit section blast equal evidence goddess scrub";
        const key = await (0, crypto_1.mnemonicToWalletKey)(mnemonic.split(" "));
        console.log("publicKey >>", Buffer.from(key.publicKey).toString("base64"));
        const wallet = ton_1.WalletContractV5R1.create({
            publicKey: key.publicKey,
            workchain: 0,
        });
        const endpoint = await (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
        const client = new ton_1.TonClient({ endpoint });
        console.log("wallet.address >>", wallet.address);
        if (!(await client.isContractDeployed(wallet.address))) {
            return console.log("wallet is not deployed");
        }
        const walletContract = client.open(wallet);
        const seqno = await walletContract.getSeqno();
        await walletContract.sendTransfer({
            secretKey: key.secretKey,
            seqno: seqno,
            messages: [
                (0, core_1.internal)({
                    to: "0QD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjZQf",
                    value: "0.05",
                    body: "Hello",
                    bounce: false,
                }),
            ],
            sendMode: 0,
        });
        let currentSeqno = seqno;
        while (currentSeqno == seqno) {
            console.log("waiting for transaction to confirm...");
            await sleep(1500);
            currentSeqno = await walletContract.getSeqno();
        }
        console.log("transaction confirmed!");
    }
    catch (e) {
        console.log(e);
    }
}
exports.tonTransfer = tonTransfer;
async function jettonTransfer() {
    try {
        const mnemonic = "square gasp bonus pole join ivory memory sort empower carpet system mammal purse organ immune result copy unit section blast equal evidence goddess scrub";
        const key = await (0, crypto_1.mnemonicToWalletKey)(mnemonic.split(" "));
        const wallet = ton_1.WalletContractV5R1.create({
            publicKey: key.publicKey,
            workchain: 0,
        });
        const endpoint = await (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
        const client = new ton_1.TonClient({ endpoint });
        console.log("지갑 주소:", wallet.address.toString());
        if (!(await client.isContractDeployed(wallet.address))) {
            return console.log("지갑이 배포되지 않았습니다.");
        }
        const jettonMasterAddress = ton_1.Address.parse("EQC_hOWH6nofwehTdADY8efs_zplcnE-0fqMbmQ2GNKBI-Zc");
        const jettonMaster = client.open(ton_1.JettonMaster.create(jettonMasterAddress));
        const senderJettonWalletAddress = await jettonMaster.getWalletAddress(wallet.address);
        const senderJettonWallet = client.open(ton_1.JettonWallet.create(senderJettonWalletAddress));
        const receiverAddress = ton_1.Address.parse("EQD3_XUU1rFa2WHSqokgsLiqAvRb_5IFAdswxzugpcrJjXJQ");
        const jettonAmount = (0, core_1.toNano)("10");
        const forwardAmount = (0, core_1.toNano)("0.01");
        const transferMessage = (0, core_1.beginCell)()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(0, 64)
            .storeCoins(jettonAmount)
            .storeAddress(receiverAddress)
            .storeAddress(wallet.address)
            .storeCoins(forwardAmount)
            .storeBit(false)
            .endCell();
        const walletContract = client.open(wallet);
        const seqno = await walletContract.getSeqno();
        await walletContract.sendTransfer({
            secretKey: key.secretKey,
            seqno: seqno,
            messages: [
                (0, core_1.internal)({
                    to: senderJettonWalletAddress,
                    value: (0, core_1.toNano)("0.05"),
                    body: transferMessage,
                }),
            ],
            sendMode: 0,
        });
        let currentSeqno = seqno;
        while (currentSeqno == seqno) {
            console.log("트랜잭션 확인 대기 중...");
            await sleep(1500);
            currentSeqno = await walletContract.getSeqno();
        }
        console.log("Jetton 전송 완료!");
    }
    catch (e) {
        console.error("Jetton 전송 중 오류 발생:", e);
    }
}
exports.jettonTransfer = jettonTransfer;
//# sourceMappingURL=ton-transfer.js.map