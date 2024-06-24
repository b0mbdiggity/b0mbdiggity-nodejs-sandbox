"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverTypedSignature = exports.signTypedData = exports.typedSignatureHash = exports.TypedDataUtils = exports.TYPED_MESSAGE_SCHEMA = exports.SignTypedDataVersion = void 0;
const util_1 = require("@ethereumjs/util");
const abi_utils_1 = require("@metamask/abi-utils");
const parsers_1 = require("@metamask/abi-utils/dist/parsers");
const utils_1 = require("@metamask/abi-utils/dist/utils");
const utils_2 = require("@metamask/utils");
const keccak_1 = require("ethereum-cryptography/keccak");
const utils_3 = require("./utils");
var SignTypedDataVersion;
(function (SignTypedDataVersion) {
    SignTypedDataVersion["V1"] = "V1";
    SignTypedDataVersion["V3"] = "V3";
    SignTypedDataVersion["V4"] = "V4";
})(SignTypedDataVersion = exports.SignTypedDataVersion || (exports.SignTypedDataVersion = {}));
exports.TYPED_MESSAGE_SCHEMA = {
    type: "object",
    properties: {
        types: {
            type: "object",
            additionalProperties: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        type: { type: "string" },
                    },
                    required: ["name", "type"],
                },
            },
        },
        primaryType: { type: "string" },
        domain: { type: "object" },
        message: { type: "object" },
    },
    required: ["types", "primaryType", "domain", "message"],
};
function validateVersion(version, allowedVersions) {
    if (!Object.keys(SignTypedDataVersion).includes(version)) {
        throw new Error(`Invalid version: '${version}'`);
    }
    else if (allowedVersions && !allowedVersions.includes(version)) {
        throw new Error(`SignTypedDataVersion not allowed: '${version}'. Allowed versions are: ${allowedVersions.join(", ")}`);
    }
}
function parseNumber(type, value) {
    (0, utils_2.assert)(value !== null, `Unable to encode value: Invalid number. Expected a valid number value, but received "${value}".`);
    const bigIntValue = BigInt(value);
    const length = (0, parsers_1.getLength)(type);
    const maxValue = BigInt(2) ** BigInt(length) - BigInt(1);
    (0, utils_2.assert)(bigIntValue >= -maxValue && bigIntValue <= maxValue, `Unable to encode value: Number "${value}" is out of range for type "${type}".`);
    return bigIntValue;
}
function reallyStrangeAddressToBytes(address) {
    let addressValue = BigInt(0);
    for (let i = 0; i < address.length; i++) {
        const character = BigInt(address.charCodeAt(i) - 48);
        addressValue *= BigInt(10);
        if (character >= 49) {
            addressValue += character - BigInt(49) + BigInt(0xa);
        }
        else if (character >= 17) {
            addressValue += character - BigInt(17) + BigInt(0xa);
        }
        else {
            addressValue += character;
        }
    }
    return (0, utils_1.padStart)((0, utils_2.bigIntToBytes)(addressValue), 20);
}
function encodeField(types, name, type, value, version) {
    validateVersion(version, [SignTypedDataVersion.V3, SignTypedDataVersion.V4]);
    if (types[type] !== undefined) {
        return [
            "bytes32",
            version === SignTypedDataVersion.V4 && value == null
                ? "0x0000000000000000000000000000000000000000000000000000000000000000"
                : (0, util_1.arrToBufArr)((0, keccak_1.keccak256)(encodeData(type, value, types, version))),
        ];
    }
    if (type === "function") {
        throw new Error('Unsupported or invalid type: "function"');
    }
    if (value === undefined) {
        throw new Error(`missing value for field ${name} of type ${type}`);
    }
    if (type === "address") {
        if (typeof value === "number") {
            return ["address", (0, utils_1.padStart)((0, utils_2.numberToBytes)(value), 20)];
        }
        else if ((0, utils_2.isStrictHexString)(value)) {
            return ["address", (0, utils_2.add0x)(value)];
        }
        else if (typeof value === "string") {
            return ["address", reallyStrangeAddressToBytes(value).subarray(0, 20)];
        }
    }
    if (type === "bool") {
        return ["bool", Boolean(value)];
    }
    if (type === "bytes") {
        if (typeof value === "number") {
            value = (0, utils_2.numberToBytes)(value);
        }
        else if ((0, utils_2.isStrictHexString)(value) || value === "0x") {
            value = (0, utils_2.hexToBytes)(value);
        }
        else if (typeof value === "string") {
            value = (0, utils_2.stringToBytes)(value);
        }
        return ["bytes32", (0, util_1.arrToBufArr)((0, keccak_1.keccak256)(value))];
    }
    if (type.startsWith("bytes") && type !== "bytes" && !type.includes("[")) {
        if (typeof value === "number") {
            if (value < 0) {
                return ["bytes32", new Uint8Array(32)];
            }
            return ["bytes32", (0, utils_2.bigIntToBytes)(BigInt(value))];
        }
        else if ((0, utils_2.isStrictHexString)(value)) {
            return ["bytes32", (0, utils_2.hexToBytes)(value)];
        }
        return ["bytes32", value];
    }
    if (type.startsWith("int") && !type.includes("[")) {
        const bigIntValue = parseNumber(type, value);
        if (bigIntValue >= BigInt(0)) {
            return ["uint256", bigIntValue];
        }
        return ["int256", bigIntValue];
    }
    if (type === "string") {
        if (typeof value === "number") {
            value = (0, utils_2.numberToBytes)(value);
        }
        else {
            value = (0, utils_2.stringToBytes)(value ?? "");
        }
        return ["bytes32", (0, util_1.arrToBufArr)((0, keccak_1.keccak256)(value))];
    }
    if (type.endsWith("]")) {
        if (version === SignTypedDataVersion.V3) {
            throw new Error("Arrays are unimplemented in encodeData; use V4 extension");
        }
        const parsedType = type.slice(0, type.lastIndexOf("["));
        const typeValuePairs = value.map((item) => encodeField(types, name, parsedType, item, version));
        return [
            "bytes32",
            (0, util_1.arrToBufArr)((0, keccak_1.keccak256)((0, abi_utils_1.encode)(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))),
        ];
    }
    return [type, value];
}
function encodeData(primaryType, data, types, version) {
    validateVersion(version, [SignTypedDataVersion.V3, SignTypedDataVersion.V4]);
    const encodedTypes = ["bytes32"];
    const encodedValues = [
        hashType(primaryType, types),
    ];
    for (const field of types[primaryType]) {
        if (version === SignTypedDataVersion.V3 && data[field.name] === undefined) {
            continue;
        }
        const [type, value] = encodeField(types, field.name, field.type, data[field.name], version);
        encodedTypes.push(type);
        encodedValues.push(value);
    }
    return (0, util_1.arrToBufArr)((0, abi_utils_1.encode)(encodedTypes, encodedValues));
}
function encodeType(primaryType, types) {
    let result = "";
    const unsortedDeps = findTypeDependencies(primaryType, types);
    unsortedDeps.delete(primaryType);
    const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
    for (const type of deps) {
        const children = types[type];
        if (!children) {
            throw new Error(`No type definition specified: ${type}`);
        }
        result += `${type}(${types[type]
            .map(({ name, type: t }) => `${t} ${name}`)
            .join(",")})`;
    }
    return result;
}
function findTypeDependencies(primaryType, types, results = new Set()) {
    if (typeof primaryType !== "string") {
        throw new Error(`Invalid findTypeDependencies input ${JSON.stringify(primaryType)}`);
    }
    const match = primaryType.match(/^\w*/u);
    [primaryType] = match;
    if (results.has(primaryType) || types[primaryType] === undefined) {
        return results;
    }
    results.add(primaryType);
    for (const field of types[primaryType]) {
        findTypeDependencies(field.type, types, results);
    }
    return results;
}
function hashStruct(primaryType, data, types, version) {
    validateVersion(version, [SignTypedDataVersion.V3, SignTypedDataVersion.V4]);
    const encoded = encodeData(primaryType, data, types, version);
    const hashed = (0, keccak_1.keccak256)(encoded);
    const buf = (0, util_1.arrToBufArr)(hashed);
    return buf;
}
function hashType(primaryType, types) {
    const encodedHashType = (0, utils_2.stringToBytes)(encodeType(primaryType, types));
    return (0, util_1.arrToBufArr)((0, keccak_1.keccak256)(encodedHashType));
}
function sanitizeData(data) {
    const sanitizedData = {};
    for (const key in exports.TYPED_MESSAGE_SCHEMA.properties) {
        if (data[key]) {
            sanitizedData[key] = data[key];
        }
    }
    if ("types" in sanitizedData) {
        sanitizedData.types = { EIP712Domain: [], ...sanitizedData.types };
    }
    return sanitizedData;
}
function eip712DomainHash(typedData, version) {
    validateVersion(version, [SignTypedDataVersion.V3, SignTypedDataVersion.V4]);
    const sanitizedData = sanitizeData(typedData);
    const { domain } = sanitizedData;
    const domainType = { EIP712Domain: sanitizedData.types.EIP712Domain };
    return hashStruct("EIP712Domain", domain, domainType, version);
}
function eip712Hash(typedData, version) {
    validateVersion(version, [SignTypedDataVersion.V3, SignTypedDataVersion.V4]);
    const sanitizedData = sanitizeData(typedData);
    const parts = [(0, utils_2.hexToBytes)("1901")];
    parts.push(eip712DomainHash(typedData, version));
    if (sanitizedData.primaryType !== "EIP712Domain") {
        parts.push(hashStruct(sanitizedData.primaryType, sanitizedData.message, sanitizedData.types, version));
    }
    return (0, util_1.arrToBufArr)((0, keccak_1.keccak256)((0, utils_2.concatBytes)(parts)));
}
exports.TypedDataUtils = {
    encodeData,
    encodeType,
    findTypeDependencies,
    hashStruct,
    hashType,
    sanitizeData,
    eip712Hash,
    eip712DomainHash,
};
function typedSignatureHash(typedData) {
    const hashBuffer = _typedSignatureHash(typedData);
    return (0, utils_2.bytesToHex)(hashBuffer);
}
exports.typedSignatureHash = typedSignatureHash;
function normalizeValue(type, value) {
    if ((0, parsers_1.isArrayType)(type) && Array.isArray(value)) {
        const [innerType] = (0, parsers_1.getArrayType)(type);
        return value.map((item) => normalizeValue(innerType, item));
    }
    if (type === "address") {
        if (typeof value === "number") {
            return (0, utils_1.padStart)((0, utils_2.numberToBytes)(value), 20);
        }
        if ((0, utils_2.isStrictHexString)(value)) {
            return (0, utils_1.padStart)((0, utils_2.hexToBytes)(value).subarray(0, 20), 20);
        }
        if (value instanceof Uint8Array) {
            return (0, utils_1.padStart)(value.subarray(0, 20), 20);
        }
    }
    if (type === "bool") {
        return Boolean(value);
    }
    if (type.startsWith("bytes") && type !== "bytes") {
        const length = (0, parsers_1.getByteLength)(type);
        if (typeof value === "number") {
            if (value < 0) {
                return new Uint8Array();
            }
            return (0, utils_2.numberToBytes)(value).subarray(0, length);
        }
        if ((0, utils_2.isStrictHexString)(value)) {
            return (0, utils_2.hexToBytes)(value).subarray(0, length);
        }
        if (value instanceof Uint8Array) {
            return value.subarray(0, length);
        }
    }
    if (type.startsWith("uint")) {
        if (typeof value === "number") {
            return Math.abs(value);
        }
    }
    if (type.startsWith("int")) {
        if (typeof value === "number") {
            const length = (0, parsers_1.getLength)(type);
            return BigInt.asIntN(length, BigInt(value));
        }
    }
    return value;
}
function normalizeAddresses(values) {
    return values.map((value) => {
        if (typeof value === "number") {
            return (0, utils_1.padStart)((0, utils_2.numberToBytes)(value), 32);
        }
        if ((0, utils_2.isStrictHexString)(value)) {
            return (0, utils_1.padStart)((0, utils_2.hexToBytes)(value).subarray(0, 32), 32);
        }
        if (value instanceof Uint8Array) {
            return (0, utils_1.padStart)(value.subarray(0, 32), 32);
        }
        return value;
    });
}
function normalizeIntegers(type, values) {
    return values.map((value) => {
        if (typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "bigint") {
            const bigIntValue = parseNumber(type, value);
            if (bigIntValue >= BigInt(0)) {
                return (0, utils_1.padStart)((0, utils_2.bigIntToBytes)(bigIntValue), 32);
            }
            const length = (0, parsers_1.getLength)(type);
            const asIntN = BigInt.asIntN(length, bigIntValue);
            return (0, utils_2.signedBigIntToBytes)(asIntN, 32);
        }
        return value;
    });
}
function _typedSignatureHash(typedData) {
    const error = new Error("Expect argument to be non-empty array");
    if (typeof typedData !== "object" ||
        !("length" in typedData) ||
        !typedData.length) {
        throw error;
    }
    const normalizedData = typedData.map(({ name, type, value }) => {
        if (type === "address[]") {
            return {
                name,
                type: "bytes32[]",
                value: normalizeAddresses(value),
            };
        }
        if (type.startsWith("int") && (0, parsers_1.isArrayType)(type)) {
            const [innerType, length] = (0, parsers_1.getArrayType)(type);
            return {
                name,
                type: `bytes32[${length ?? ""}]`,
                value: normalizeIntegers(innerType, value),
            };
        }
        return {
            name,
            type,
            value: normalizeValue(type, value),
        };
    });
    const data = normalizedData.map((e) => {
        if (e.type !== "bytes") {
            return e.value;
        }
        return (0, utils_3.legacyToBuffer)(e.value);
    });
    const types = normalizedData.map((e) => {
        if (e.type === "function") {
            throw new Error('Unsupported or invalid type: "function"');
        }
        return e.type;
    });
    const schema = typedData.map((e) => {
        if (!e.name) {
            throw error;
        }
        return `${e.type} ${e.name}`;
    });
    return (0, util_1.arrToBufArr)((0, keccak_1.keccak256)((0, abi_utils_1.encodePacked)(["bytes32", "bytes32"], [
        (0, keccak_1.keccak256)((0, abi_utils_1.encodePacked)(["string[]"], [schema], true)),
        (0, keccak_1.keccak256)((0, abi_utils_1.encodePacked)(types, data, true)),
    ])));
}
function signTypedData({ privateKey, data, version, }) {
    validateVersion(version);
    if ((0, utils_3.isNullish)(data)) {
        throw new Error("Missing data parameter");
    }
    else if ((0, utils_3.isNullish)(privateKey)) {
        throw new Error("Missing private key parameter");
    }
    const messageHash = version === SignTypedDataVersion.V1
        ? _typedSignatureHash(data)
        : exports.TypedDataUtils.eip712Hash(data, version);
    const sig = (0, util_1.ecsign)(messageHash, privateKey);
    return (0, utils_3.concatSig)((0, util_1.arrToBufArr)((0, utils_2.bigIntToBytes)(sig.v)), sig.r, sig.s);
}
exports.signTypedData = signTypedData;
function recoverTypedSignature({ data, signature, version, }) {
    validateVersion(version);
    if ((0, utils_3.isNullish)(data)) {
        throw new Error("Missing data parameter");
    }
    else if ((0, utils_3.isNullish)(signature)) {
        throw new Error("Missing signature parameter");
    }
    const messageHash = version === SignTypedDataVersion.V1
        ? _typedSignatureHash(data)
        : exports.TypedDataUtils.eip712Hash(data, version);
    const publicKey = (0, utils_3.recoverPublicKey)(messageHash, signature);
    const sender = (0, util_1.publicToAddress)(publicKey);
    return (0, utils_2.bytesToHex)(sender);
}
exports.recoverTypedSignature = recoverTypedSignature;
//# sourceMappingURL=sign-typed-data.js.map