"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const bls_signatures_1 = __importDefault(require("bls-signatures"));
const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
const toHexString = (bytes) => ('0x' + bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''));
const blsSkToPk = (BLS, pkString) => {
    var sk = BLS.PrivateKey.from_bytes(fromHexString(pkString), false);
    var pk = sk.get_g1();
    return toHexString(pk.serialize());
};
const CaverExtKAS = require("caver-js-ext-kas");
const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
const temp = {
    haha: [{ id: 1 }, { id: 2 }, { id: 3 }],
    hehe: [{ id: 1 }, { id: 2 }, { id: 3 }],
};
const sandbox = async () => {
    aws_sdk_1.default.config.update({ region: 'ap-northeast-3' });
    const ssm = new aws_sdk_1.default.SSM({ region: 'ap-northeast-3' });
    let nextToken = null;
    let params = [];
    try {
        const result = await ssm.getParametersByPath({ Path: '/mbp-chain-validators/', WithDecryption: true, Recursive: true }).promise();
        params = params.concat(result.Parameters);
        nextToken = result.NextToken;
        while (nextToken) {
            const res = await ssm.getParametersByPath({ Path: '/mbp-chain-validators/', WithDecryption: true, Recursive: true, NextToken: nextToken }).promise();
            params = params.concat(res.Parameters);
            nextToken = res.NextToken;
        }
    }
    catch (e) {
        console.log(e);
    }
    const ret0 = params.filter((e) => e.Name.includes('validator-key')).map((e) => e.Name);
    const ret = params.filter((e) => e.Name.includes('validator-key')).map((e) => e.Value);
    const ret2 = params.filter((e) => e.Name.includes('validator-bls-key')).map((e) => e.Value);
    const BLS = await (0, bls_signatures_1.default)();
    console.log(ret0, ret0.length, ret0.map((e) => {
        return e;
    }), 'name');
    console.log(ret, ret.length, ret.map((e) => {
    }), 'pk');
    console.log(ret2.map((e) => {
        return blsSkToPk(BLS, e);
    }), ret2.length, 'bls');
};
const crypto_1 = __importDefault(require("crypto"));
const encryptTest = () => {
    const generateKey = () => {
        return crypto_1.default.randomBytes(32);
    };
    const decrypt = (ciphertext, key) => {
        const iv = ciphertext.slice(0, 16);
        const encryptedData = ciphertext.slice(16);
        const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', key, iv);
        const plaintext = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        return plaintext.toString('utf8');
    };
    const encrypt = (plaintext, key) => {
        const iv = crypto_1.default.randomBytes(16);
        const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
        const encoded = Buffer.concat([iv, ciphertext]).toString('base64');
        return encoded;
    };
    const key = '39a4f9490d0b3d559c88b0c6525254492a3624c9ddb2349b8b48df05047a19c3';
    for (let i = 69; i < 75; i++) {
        const data = {
            side: 1,
            tokenId: i.toString(),
            contractAddress: "0xb1a25b48c9f0a53d07854e883962775e15814398",
            listingTime: 169949694 + i,
            maker: "0xfacea74fb5084aa624efdb1237779691950a4898",
            basePrice: "10000000000000000000000",
            paymentToken: "0x0000000000000000000000000000000000000100",
            network: "uptn",
        };
        const plaintext = JSON.stringify(data);
        const ciphertext = encrypt(plaintext, key);
        console.log(ciphertext);
    }
};
const test = async () => {
    let NetworkType;
    (function (NetworkType) {
        NetworkType["Uptn"] = "uptn";
    })(NetworkType || (NetworkType = {}));
    for (const e in NetworkType) {
        const network = NetworkType[e];
        const foo = NetworkType[network];
        console.log(e, network, foo);
    }
};
test();
//# sourceMappingURL=tssandbox.js.map