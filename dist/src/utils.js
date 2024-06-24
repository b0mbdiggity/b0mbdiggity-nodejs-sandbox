"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = exports.recoverPublicKey = exports.concatSig = exports.legacyToBuffer = exports.isNullish = exports.padWithZeroes = void 0;
const util_1 = require("@ethereumjs/util");
const utils_1 = require("@metamask/utils");
function padWithZeroes(hexString, targetLength) {
    if (hexString !== "" && !/^[a-f0-9]+$/iu.test(hexString)) {
        throw new Error(`Expected an unprefixed hex string. Received: ${hexString}`);
    }
    if (targetLength < 0) {
        throw new Error(`Expected a non-negative integer target length. Received: ${targetLength}`);
    }
    return String.prototype.padStart.call(hexString, targetLength, "0");
}
exports.padWithZeroes = padWithZeroes;
function isNullish(value) {
    return value === null || value === undefined;
}
exports.isNullish = isNullish;
function legacyToBuffer(value) {
    return typeof value === "string" && !(0, util_1.isHexString)(value)
        ? Buffer.from(value)
        : (0, util_1.toBuffer)(value);
}
exports.legacyToBuffer = legacyToBuffer;
function concatSig(v, r, s) {
    const rSig = (0, util_1.fromSigned)(r);
    const sSig = (0, util_1.fromSigned)(s);
    const vSig = (0, util_1.bufferToInt)(v);
    const rStr = padWithZeroes((0, util_1.toUnsigned)(rSig).toString("hex"), 64);
    const sStr = padWithZeroes((0, util_1.toUnsigned)(sSig).toString("hex"), 64);
    const vStr = (0, utils_1.remove0x)((0, utils_1.numberToHex)(vSig));
    return (0, utils_1.add0x)(rStr.concat(sStr, vStr));
}
exports.concatSig = concatSig;
function recoverPublicKey(messageHash, signature) {
    const sigParams = (0, util_1.fromRpcSig)(signature);
    return (0, util_1.ecrecover)(messageHash, sigParams.v, sigParams.r, sigParams.s);
}
exports.recoverPublicKey = recoverPublicKey;
function normalize(input) {
    if (isNullish(input)) {
        return undefined;
    }
    if (typeof input === "number") {
        if (input < 0) {
            return "0x";
        }
        const buffer = (0, utils_1.numberToBytes)(input);
        input = (0, utils_1.bytesToHex)(buffer);
    }
    if (typeof input !== "string") {
        let msg = "eth-sig-util.normalize() requires hex string or integer input.";
        msg += ` received ${typeof input}: ${input}`;
        throw new Error(msg);
    }
    return (0, utils_1.add0x)(input.toLowerCase());
}
exports.normalize = normalize;
//# sourceMappingURL=utils.js.map