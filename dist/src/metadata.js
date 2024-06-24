"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeMetadata = exports.getMetadataAccount = exports.MetadataKey = exports.METADATA_PREFIX = exports.METADATA_PROGRAM_ID = void 0;
const borsh_1 = require("borsh");
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
exports.METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
exports.METADATA_PREFIX = "metadata";
const PubKeysInternedMap = new Map();
borsh_1.BinaryReader.prototype.readPubkey = function () {
    const reader = this;
    const array = reader.readFixedArray(32);
    return new web3_js_1.PublicKey(array);
};
borsh_1.BinaryWriter.prototype.writePubkey = function (value) {
    const writer = this;
    writer.writeFixedArray(value.toBuffer());
};
borsh_1.BinaryReader.prototype.readPubkeyAsString = function () {
    const reader = this;
    const array = reader.readFixedArray(32);
    return bs58_1.default.encode(array);
};
borsh_1.BinaryWriter.prototype.writePubkeyAsString = function (value) {
    const writer = this;
    writer.writeFixedArray(bs58_1.default.decode(value));
};
const toPublicKey = (key) => {
    if (typeof key !== "string") {
        return key;
    }
    let result = PubKeysInternedMap.get(key);
    if (!result) {
        result = new web3_js_1.PublicKey(key);
        PubKeysInternedMap.set(key, result);
    }
    return result;
};
const findProgramAddress = async (seeds, programId) => {
    const key = "pda-" +
        seeds.reduce((agg, item) => agg + item.toString("hex"), "") +
        programId.toString();
    const result = await web3_js_1.PublicKey.findProgramAddress(seeds, programId);
    return [result[0].toBase58(), result[1]];
};
var MetadataKey;
(function (MetadataKey) {
    MetadataKey[MetadataKey["Uninitialized"] = 0] = "Uninitialized";
    MetadataKey[MetadataKey["MetadataV1"] = 4] = "MetadataV1";
    MetadataKey[MetadataKey["EditionV1"] = 1] = "EditionV1";
    MetadataKey[MetadataKey["MasterEditionV1"] = 2] = "MasterEditionV1";
    MetadataKey[MetadataKey["MasterEditionV2"] = 6] = "MasterEditionV2";
    MetadataKey[MetadataKey["EditionMarker"] = 7] = "EditionMarker";
})(MetadataKey = exports.MetadataKey || (exports.MetadataKey = {}));
class Creator {
    address;
    verified;
    share;
    constructor(args) {
        this.address = args.address;
        this.verified = args.verified;
        this.share = args.share;
    }
}
class Data {
    name;
    symbol;
    uri;
    sellerFeeBasisPoints;
    creators;
    constructor(args) {
        this.name = args.name;
        this.symbol = args.symbol;
        this.uri = args.uri;
        this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
        this.creators = args.creators;
    }
}
class Metadata {
    key;
    updateAuthority;
    mint;
    data;
    primarySaleHappened;
    isMutable;
    editionNonce;
    masterEdition;
    edition;
    constructor(args) {
        this.key = MetadataKey.MetadataV1;
        this.updateAuthority = args.updateAuthority;
        this.mint = args.mint;
        this.data = args.data;
        this.primarySaleHappened = args.primarySaleHappened;
        this.isMutable = args.isMutable;
        this.editionNonce = args.editionNonce;
    }
}
const METADATA_SCHEMA = new Map([
    [
        Data,
        {
            kind: "struct",
            fields: [
                ["name", "string"],
                ["symbol", "string"],
                ["uri", "string"],
                ["sellerFeeBasisPoints", "u16"],
                ["creators", { kind: "option", type: [Creator] }],
            ],
        },
    ],
    [
        Creator,
        {
            kind: "struct",
            fields: [
                ["address", "pubkeyAsString"],
                ["verified", "u8"],
                ["share", "u8"],
            ],
        },
    ],
    [
        Metadata,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["updateAuthority", "pubkeyAsString"],
                ["mint", "pubkeyAsString"],
                ["data", Data],
                ["primarySaleHappened", "u8"],
                ["isMutable", "u8"],
            ],
        },
    ],
]);
async function getMetadataAccount(tokenMint) {
    return (await findProgramAddress([
        Buffer.from(exports.METADATA_PREFIX),
        toPublicKey(exports.METADATA_PROGRAM_ID).toBuffer(),
        toPublicKey(tokenMint).toBuffer(),
    ], toPublicKey(exports.METADATA_PROGRAM_ID)))[0];
}
exports.getMetadataAccount = getMetadataAccount;
const METADATA_REPLACE = new RegExp("\u0000", "g");
const decodeMetadata = (buffer) => {
    const metadata = (0, borsh_1.deserializeUnchecked)(METADATA_SCHEMA, Metadata, buffer);
    metadata.data.name = metadata.data.name.replace(METADATA_REPLACE, "");
    metadata.data.uri = metadata.data.uri.replace(METADATA_REPLACE, "");
    metadata.data.symbol = metadata.data.symbol.replace(METADATA_REPLACE, "");
    return metadata;
};
exports.decodeMetadata = decodeMetadata;
//# sourceMappingURL=metadata.js.map