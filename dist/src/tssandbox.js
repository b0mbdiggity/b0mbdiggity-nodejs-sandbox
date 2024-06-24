"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVERSE_BASIS_POINT = exports.FIXED_NUMBER_100 = exports.SalesListRequest = exports.AssetKey = exports.SaleListStatus = void 0;
require("reflect-metadata");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const bls_signatures_1 = __importDefault(require("bls-signatures"));
const uuid_1 = require("uuid");
const ethers_1 = require("ethers");
const ERC721_json_1 = __importDefault(require("./ERC721.json"));
const ERC20GSN_json_1 = __importDefault(require("./ERC20GSN.json"));
const Orders_json_1 = __importDefault(require("./Orders.json"));
const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
const toHexString = (bytes) => "0x" +
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
const blsSkToPk = (BLS, pkString) => {
    var sk = BLS.PrivateKey.from_bytes(fromHexString(pkString), false);
    var pk = sk.get_g1();
    return toHexString(pk.serialize());
};
const CaverExtKAS = require("caver-js-ext-kas");
const delay = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});
const temp = {
    haha: [{ id: 1 }, { id: 2 }, { id: 3 }],
    hehe: [{ id: 1 }, { id: 2 }, { id: 3 }],
};
const sandbox = async () => {
    aws_sdk_1.default.config.update({ region: "ap-northeast-3" });
    const ssm = new aws_sdk_1.default.SSM({ region: "ap-northeast-3" });
    let nextToken = null;
    let params = [];
    try {
        const result = await ssm
            .getParametersByPath({
            Path: "/mbp-chain-validators/",
            WithDecryption: true,
            Recursive: true,
        })
            .promise();
        params = params.concat(result.Parameters);
        nextToken = result.NextToken;
        while (nextToken) {
            const res = await ssm
                .getParametersByPath({
                Path: "/mbp-chain-validators/",
                WithDecryption: true,
                Recursive: true,
                NextToken: nextToken,
            })
                .promise();
            params = params.concat(res.Parameters);
            nextToken = res.NextToken;
        }
    }
    catch (e) {
        console.log(e);
    }
    const ret0 = params
        .filter((e) => e.Name.includes("validator-key"))
        .map((e) => e.Name);
    const ret = params
        .filter((e) => e.Name.includes("validator-key"))
        .map((e) => e.Value);
    const ret2 = params
        .filter((e) => e.Name.includes("validator-bls-key"))
        .map((e) => e.Value);
    const BLS = await (0, bls_signatures_1.default)();
    console.log(ret0, ret0.length, ret0.map((e) => {
        return e;
    }), "name");
    console.log(ret, ret.length, ret.map((e) => {
    }), "pk");
    console.log(ret2.map((e) => {
        return blsSkToPk(BLS, e);
    }), ret2.length, "bls");
};
const crypto_1 = __importDefault(require("crypto"));
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const moment_1 = __importDefault(require("moment"));
const encryptTest = () => {
    const generateKey = () => {
        return crypto_1.default.randomBytes(32);
    };
    const decrypt = (ciphertext, key) => {
        const iv = ciphertext.slice(0, 16);
        const encryptedData = ciphertext.slice(16);
        const decipher = crypto_1.default.createDecipheriv("aes-256-cbc", key, iv);
        const plaintext = Buffer.concat([
            decipher.update(encryptedData),
            decipher.final(),
        ]);
        return plaintext.toString("utf8");
    };
    const encrypt = (plaintext, key) => {
        const iv = crypto_1.default.randomBytes(16);
        const cipher = crypto_1.default.createCipheriv("aes-256-cbc", Buffer.from(key, "hex"), iv);
        const ciphertext = Buffer.concat([
            cipher.update(plaintext, "utf8"),
            cipher.final(),
        ]);
        const encoded = Buffer.concat([iv, ciphertext]).toString("base64");
        return encodeURIComponent(encoded);
        return encoded;
    };
    const key = "39a4f9490d0b3d559c88b0c6525254492a3624c9ddb2349b8b48df05047a19c3";
    const data = {
        uid: "test123123",
        contractAddress: "0x3f357b6b54b762e5B8476C9Cfa666660F4394ffd",
        timestamp: Date.now() / 1000,
        nonce: (0, uuid_1.v4)(),
    };
    const plaintext = JSON.stringify(data);
    const ciphertext = encrypt(plaintext, key);
    console.log(ciphertext);
};
const DEFAULT_START_DAY = "2021-06-01";
const DEFAULT_START_MONTH = "2021-06";
var SaleListStatus;
(function (SaleListStatus) {
    SaleListStatus["All"] = "all";
    SaleListStatus["OnSale"] = "onSale";
    SaleListStatus["Cancelled"] = "cancelled";
})(SaleListStatus = exports.SaleListStatus || (exports.SaleListStatus = {}));
class AssetKey {
    network;
    address;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssetKey.prototype, "network", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssetKey.prototype, "address", void 0);
exports.AssetKey = AssetKey;
class SalesListRequest {
    assets;
    startDateISO;
    endDateISO;
    status;
    searchString;
    startDate = DEFAULT_START_DAY;
    endDate = moment_1.default.utc().format("YYYY-MM-DD");
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], SalesListRequest.prototype, "assets", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => moment_1.default.utc(obj.startDate).isValid() ? moment_1.default.utc(obj.startDate) : null),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], SalesListRequest.prototype, "startDateISO", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ obj }) => moment_1.default.utc(obj.endDate).isValid() ? moment_1.default.utc(obj.endDate) : null),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], SalesListRequest.prototype, "endDateISO", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(SaleListStatus),
    __metadata("design:type", String)
], SalesListRequest.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SalesListRequest.prototype, "searchString", void 0);
__decorate([
    (0, class_validator_1.Length)(7, 10),
    __metadata("design:type", String)
], SalesListRequest.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.Length)(7, 10),
    __metadata("design:type", String)
], SalesListRequest.prototype, "endDate", void 0);
exports.SalesListRequest = SalesListRequest;
const gsn_1 = require("./gsn");
exports.FIXED_NUMBER_100 = ethers_1.FixedNumber.fromValue(100);
exports.INVERSE_BASIS_POINT = 10000n;
const prKeys = [
    "78dc0074e5d5bdf74eb932b08870bd440e395e7e5898dcbf7dfea228befd737f",
    "355a77a293e90cbb9ca09b90a783c549541cb1d742e856f8cbf61024c0f39673",
    "a2e13c663a7a6d11a51e369e5dfbc276215402d528860bce7337ceb92c72ffb5",
    "d0aad3929125f070c11d9bdd96a33996edc55c11c092a35663f2ee760d834c21",
    "f1a6e408fb3b28bdd1ae86cbc89d6e9676db53de46d03f2fdb321fe1313193b6",
    "bba9ea8e4f30c707666a4f35cb1e4372687fba4d9889ea14025acf838354557d",
    "261b748eb8c6066396f749c74295a09f5298586ff577021853bd5d99b8ddc826",
    "29a8d85a4aa09ef765c747fbab52d4d92cf154b16a10a95a1f3bcd150b372e3f",
    "855502618aeb0fe7af3682c179834c54caa1a8eee63f66a1e06b3598224edf1c",
    "d4a4f4358dff8dce36836984b12837acb4d652dc1d19ba4914f5dd54056582c5",
    "da5a585053282a8781c272fb36732b51030b92b56ac944b1f0808e6e493eaf3a",
    "b45d7355386e5b4c801dcf6a5040ab023c1c2082092589f30a5e301848078f1a",
    "b5cdbedb7ada16b2f93f3d7d63ee344e3a78611f1996f97137f366ca00463b62",
    "8ebe1178e17ea3a2480f2ea6b99bc09272584417b8a283238d98687e7061108b",
    "243e71be4dc1fe65dc70627e31aff77a30c7f3bdbcccd5ecfeb663a7469a1675",
    "730598fa56adf93d35ed0d6dd053f577c184e7e539bb2ab400d8996ec3cba63f",
    "66effd5ef727cef08564b13e5a14c3bf68b9a5202edc77bf3e6e05e3e6b08cee",
    "f706eb922ddd81bf4635353d40c442822c8eedff2e5d70f01672bb57acc8f952",
    "3cdf16e81d8b1e247386c286d17edce13cdf5206901824f09bafa482bc2653d2",
    "8bb2790ee4a35ff3a6180f55c34a6b3f9b92f36823197b096e1e996fde1016ed",
    "a437a3749361560ee04edf4819be654d9aabff0fed3e8094647ff2a68c507c5e",
    "d95a73ca674542dde2a543865eb885178bb9f48f1a6f07724580f6eee1ac8669",
    "8dddd2b2b8eda7d6fcdf540337a7e6ab2d4a60cd8c573e6f81b6c30dd2714d05",
    "97858153fc2cb2ac30d8ca35999369850be887fe07b44d3b72c1972c6df95636",
    "b7ebb6854d4cd6b0ff01acdda94ea4ac0b9df4637b9044eac15133c22e079136",
    "22ae9e78a31868e3ee8c388e13dd0bd3b8e27579533f3905cd8d4f6944c8cec0",
    "b3ddc27b866752ae3a6ff858caa1be677f1ff8db1ffea2732b6490abf77daac5",
    "39accc98a0442a6ec574900a3538e592325ac77a5de9c9b225bdad75308f2ce3",
    "72f5a9ca9dd0e4b71237264c2ab3deb1a257613b15be3b0193a50ae18c308718",
    "087b1fb556bf16366ae578b95eabb26a5b471fbd655d492346a4e0aa8894854a",
];
const addresses = [];
const test = async () => {
    for (const prKey of prKeys) {
        const provider = new ethers_1.JsonRpcProvider("https://node-api.alp.uptn.io/v1/app/rpc");
        const reciever = new ethers_1.Wallet(prKey, provider);
        const contract = new ethers_1.ethers.Contract("0xab358D64b2371B4e2B4879A121520959103717C3", ERC20GSN_json_1.default.abi, reciever);
        console.log(reciever.address);
        const gsn = new gsn_1.SkpGSN(reciever);
        const data = await contract.approve.populateTransaction("0x15b02237ac996862625f4874e06081de19b83b15", ethers_1.ethers.parseEther("1000000"));
        const result = await gsn.gsnTransact("0xab358D64b2371B4e2B4879A121520959103717C3", data.data, reciever);
        console.log(result);
    }
};
const erc721 = async () => {
    const provider = new ethers_1.JsonRpcProvider("https://node-api.dev.uptn.io/v1/app/rpc");
    const signer = new ethers_1.Wallet("0x78dc0074e5d5bdf74eb932b08870bd440e395e7e5898dcbf7dfea228befd737f", provider);
    console.log(signer.address);
    const gsn = new gsn_1.SkpGSN(signer);
    const contract = new ethers_1.ethers.Contract("0xb1A25B48c9F0a53d07854e883962775e15814398", ERC721_json_1.default.abi, signer);
    const allowance = await contract.isApprovedForAll(signer.address, "0x1fcd738e3A9DAE84CD0808a89cA324Ec5f32731d");
    console.log("allowance>>", allowance);
};
const erc20 = async () => {
    const provider = new ethers_1.JsonRpcProvider("https://node-api.alp.uptn.io/v1/app/rpc");
    const signer = new ethers_1.Wallet("0x78dc0074e5d5bdf74eb932b08870bd440e395e7e5898dcbf7dfea228befd737f", provider);
    console.log(signer.address);
    const gsn = new gsn_1.SkpGSN(signer);
    const factory = new ethers_1.ContractFactory(ERC20GSN_json_1.default.abi, ERC20GSN_json_1.default.bytecode, signer);
    const data = await factory.getDeployTransaction("test erc20", "TEST", "0x47641862F87f7f542f7c06B7EFEd656ba73E8b5d");
    const result = await gsn.gsnTransact("0xb1A25B48c9F0a53d07854e883962775e15814398", data.data, signer);
    console.log(result);
};
const fs_1 = __importDefault(require("fs"));
const sortTest = async () => {
    const files = fs_1.default.createWriteStream(`cancelquery.txt`);
    for (const order of Orders_json_1.default.list) {
        files.write(`INSERT INTO order_event(order_id, maker, event_time, event_type, attribute)
        select '${order}' as order_id, o.maker, GETDATE(), 'CANCEL' as event_type, null as attribute from [order] o where o.order_id = '${order}'`);
    }
    files.end();
};
const migrationMatch = async () => {
    const sheetDataList = [
        "0xf0495a6A66F034dA674396Ed53e072FC28bE3272",
        "0x12654b5127c0437CDEf7A9794aD800a284e6a0Ea",
        "0x9B7648eCD65EA0567d843112058417f89adB845f",
        "0x0fa1f5eb34BD0a90E2B525A0118286308DE6b422",
        "0x9DB0947a4CBaF6e2058c3fDBd936dB34CdA39511",
        "0xaCE05fB7D3bBe251F790470451fA1E73676Fa88E",
    ];
    const transactionDataList = [
        "0xf0495a6A66F034dA674396Ed53e072FC28bE3272",
        "0x12654b5127c0437CDEf7A9794aD800a284e6a0Ea",
        "0x9B7648eCD65EA0567d843112058417f89adB845f",
        "0x0fa1f5eb34BD0a90E2B525A0118286308DE6b422",
        "0x9DB0947a4CBaF6e2058c3fDBd936dB34CdA39511",
        "0xaCE05fB7D3bBe251F790470451fA1E73676Fa88E",
    ];
    console.log(sheetDataList.length, transactionDataList.length);
    for (const sheetData of sheetDataList) {
        const found = transactionDataList.find((e) => e === sheetData);
        if (!found) {
            console.log("not matched sheetDataList", sheetData);
        }
    }
    for (const transactionData of transactionDataList) {
        const found = sheetDataList.find((e) => e === transactionData);
        if (!found) {
            console.log("not matched transactionDataList", transactionData);
        }
    }
};
const groupBy = async () => {
    const sheetDataList = [];
    const mapper = [];
    for (const sheetData of sheetDataList) {
        const foundIndex = mapper.findIndex((e) => e.key === sheetData);
        if (foundIndex > -1) {
            mapper[foundIndex].count++;
        }
        else {
            mapper.push({ key: sheetData, count: 1 });
        }
    }
    console.log(mapper.filter((e) => e.count > 1));
};
const omok = async () => {
    const inputData = "0x93daadf2000000000000000000000000000000006db5c74787ccbb131f17757948ff4a13";
    const abi = [
        "function execute(tuple(address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data,uint256 validUntilTime),bytes32 domainSeparator,bytes32 requestTypeHash,bytes suffixData,bytes sig)",
    ];
    const functionSignature = "execute((address,address,uint256,uint256,uint256,bytes,uint256),bytes32,bytes32,bytes,bytes)";
    const iface = new ethers_1.Interface(abi);
    const decodedData = iface.decodeFunctionData(functionSignature, inputData);
    console.log(decodedData);
};
const alchemy_sdk_1 = require("alchemy-sdk");
const nft = async () => {
    doubleTicket();
    ticket();
};
const doubleTicket = async () => {
    const config = {
        apiKey: "q445U3OlAsYtRVIAeUoqY7W_XciMQSfD",
        network: alchemy_sdk_1.Network.MATIC_MAINNET,
    };
    const alchemy = new alchemy_sdk_1.Alchemy(config);
    const address = "0x616DB65C22B16e7F08C66B4B592eBE88FaD92E16";
    const owners = await alchemy.nft.getOwnersForContract(address);
    console.log("owners length >>", owners.owners.length);
    const files = fs_1.default.createWriteStream(`tournament-double-ticket.csv`);
    for (const owner of owners.owners) {
        if (owner === "0x0000000000000000000000000000000000000000")
            continue;
        const nfts = await alchemy.nft.getNftsForOwner(owner, {
            contractAddresses: [address],
            omitMetadata: true,
        });
        console.log(owner, ">>", nfts.ownedNfts.map((e) => e.tokenId));
        for (const tokenId of nfts.ownedNfts.map((e) => e.tokenId)) {
            const code = (parseInt(tokenId, 10) / 100000000).toFixed(0);
            let type;
            if (code === "100010030")
                type = "ticket_1_30";
            if (code === "100030090")
                type = "ticket_3_90";
            if (code === "100100300")
                type = "ticket_10_300";
            if (code === "100200600")
                type = "ticket_20_600";
            if (code === "100401200")
                type = "ticket_40_1200";
            files.write(`${owner},${type},${tokenId}\n`);
        }
    }
    files.end();
};
const ticket = async () => {
    const config = {
        apiKey: "q445U3OlAsYtRVIAeUoqY7W_XciMQSfD",
        network: alchemy_sdk_1.Network.MATIC_MAINNET,
    };
    const alchemy = new alchemy_sdk_1.Alchemy(config);
    const address = "0x53532EdB41F2dbf2a3d45f71e2Ba9423Fecfd3af";
    const owners = await alchemy.nft.getOwnersForContract(address);
    console.log("owners length >>", owners.owners.length);
    const files = fs_1.default.createWriteStream(`tournament-ticket.csv`);
    for (const owner of owners.owners) {
        if (owner === "0x0000000000000000000000000000000000000000")
            continue;
        const nfts = await alchemy.nft.getNftsForOwner(owner, {
            contractAddresses: [address],
            omitMetadata: true,
        });
        console.log(owner, ">>", nfts.ownedNfts.map((e) => e.tokenId));
        for (const tokenId of nfts.ownedNfts.map((e) => e.tokenId)) {
            const code = (parseInt(tokenId, 10) / 100000000).toFixed(0);
            let type;
            if (code === "1")
                type = "ticket_10";
            if (code === "2")
                type = "ticket_30";
            if (code === "3")
                type = "ticket_90";
            if (code === "4")
                type = "ticket_100";
            if (code === "5")
                type = "ticket_300";
            files.write(`${owner},${type},${tokenId}\n`);
        }
    }
    files.end();
};
const playzList = [
    {
        address: "0xc58C5A1c29fcC53e3041D5f889dEA9cE683B3a3C",
        name: "playzV2-polygon",
    },
    {
        address: "0x047c2fAB5E150b5c47bF636FDD2F87E462F42D11",
        name: "dragon-polygon",
    },
];
const playz = async () => {
    const config = {
        apiKey: "q445U3OlAsYtRVIAeUoqY7W_XciMQSfD",
        network: alchemy_sdk_1.Network.MATIC_MAINNET,
    };
    const alchemy = new alchemy_sdk_1.Alchemy(config);
    const address = "0x8494d2ed08c85A6B9014fB298f4373F2e5911b87";
    const owners = await alchemy.nft.getOwnersForContract(address);
    console.log("owners length >>", owners.owners.length);
    const files = fs_1.default.createWriteStream(`playz-polygon.csv`);
    for (const owner of owners.owners) {
        if (owner === "0x0000000000000000000000000000000000000000")
            continue;
        try {
            const nfts = await alchemy.nft.getNftsForOwner(owner, {
                contractAddresses: [address],
                omitMetadata: false,
            });
            for (const nft of nfts.ownedNfts) {
                const attribute = nft.raw.metadata.attributes?.find((e) => e.trait_type === "Grade");
                files.write(`${owner},${attribute?.value},${nft.tokenId}\n`);
            }
        }
        catch (e) {
            console.log(owner, e);
            console.log();
        }
    }
    files.end();
};
const datetest = () => {
    class B {
        hehe = 'hehe';
    }
    class A {
        haha;
        static from(b) {
            const instance = (0, class_transformer_1.plainToInstance)(A, b.map((e) => ({ haha: e.hehe })));
            console.log(instance);
            return instance;
        }
    }
    console.log(A.from([new B(), new B()]));
};
datetest();
//# sourceMappingURL=tssandbox.js.map