"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParsePublicKey = void 0;
const ton_1 = require("@ton/ton");
const buffer_1 = require("buffer");
const wallet_contract_v4_r1_1 = require("./wallet-contract-v4-r1");
const knownWallets = [
    { contract: ton_1.WalletContractV1R1, loadData: loadWalletV1Data },
    { contract: ton_1.WalletContractV1R2, loadData: loadWalletV1Data },
    { contract: ton_1.WalletContractV1R3, loadData: loadWalletV1Data },
    { contract: ton_1.WalletContractV2R1, loadData: loadWalletV2Data },
    { contract: ton_1.WalletContractV2R2, loadData: loadWalletV2Data },
    { contract: ton_1.WalletContractV3R1, loadData: loadWalletV3Data },
    { contract: ton_1.WalletContractV3R2, loadData: loadWalletV3Data },
    { contract: wallet_contract_v4_r1_1.WalletContractV4R1, loadData: loadWalletV4Data },
    { contract: ton_1.WalletContractV4, loadData: loadWalletV4Data },
    { contract: ton_1.WalletContractV5Beta, loadData: loadWalletV5BetaData },
    { contract: ton_1.WalletContractV5R1, loadData: loadWalletV5Data },
].map(({ contract, loadData }) => ({
    contract: contract,
    loadData: loadData,
    wallet: contract.create({ workchain: 0, publicKey: buffer_1.Buffer.alloc(32) }),
}));
function loadWalletV1Data(cs) {
    const seqno = cs.loadUint(32);
    const publicKey = cs.loadBuffer(32);
    return { seqno, publicKey };
}
function loadWalletV2Data(cs) {
    const seqno = cs.loadUint(32);
    const publicKey = cs.loadBuffer(32);
    return { seqno, publicKey };
}
function loadWalletV3Data(cs) {
    const seqno = cs.loadUint(32);
    const walletId = cs.loadUint(32);
    const publicKey = cs.loadBuffer(32);
    return { seqno, publicKey, walletId };
}
function loadWalletV4Data(cs) {
    const seqno = cs.loadUint(32);
    const walletId = cs.loadUint(32);
    const publicKey = cs.loadBuffer(32);
    const plugins = cs.loadMaybeRef();
    return { seqno, publicKey, walletId, plugins };
}
function loadWalletV5BetaData(cs) {
    const isSignatureAuthAllowed = cs.loadBoolean();
    const seqno = cs.loadUint(32);
    const walletId = cs.loadUintBig(80);
    const publicKey = cs.loadBuffer(32);
    const plugins = cs.loadMaybeRef();
    return { isSignatureAuthAllowed, seqno, publicKey, walletId, plugins };
}
function loadWalletV5Data(cs) {
    const isSignatureAuthAllowed = cs.loadBoolean();
    const seqno = cs.loadUint(32);
    const walletId = cs.loadUint(32);
    const publicKey = cs.loadBuffer(32);
    const plugins = cs.loadMaybeRef();
    return { isSignatureAuthAllowed, seqno, publicKey, walletId, plugins };
}
function tryParsePublicKey(stateInit) {
    if (!stateInit.code || !stateInit.data) {
        return null;
    }
    for (const { wallet, loadData } of knownWallets) {
        try {
            if (wallet.init.code.equals(stateInit.code)) {
                return loadData(stateInit.data.beginParse()).publicKey;
            }
        }
        catch (e) {
        }
    }
    return null;
}
exports.tryParsePublicKey = tryParsePublicKey;
//# sourceMappingURL=wallets-data.js.map