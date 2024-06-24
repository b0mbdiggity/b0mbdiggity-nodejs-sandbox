"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkpGSN = void 0;
const ethers_1 = require("ethers");
const Forwarder_json_1 = __importDefault(require("./Forwarder.json"));
class SkpGSN {
    gsnRpcGatewayProvider;
    contract;
    forwarderAddress;
    chainId;
    uptnRpcProvider;
    dataSigner;
    constructor(signer) {
        const providerOptions = {
            batchMaxCount: 1,
            staticNetwork: true,
        };
        this.gsnRpcGatewayProvider = new ethers_1.JsonRpcProvider("https://node-api.alp.uptn.io/v1/app/rpc", undefined, providerOptions);
        this.chainId = 6116;
        this.forwarderAddress = "0x47641862F87f7f542f7c06B7EFEd656ba73E8b5d";
        this.uptnRpcProvider = new ethers_1.JsonRpcProvider("https://node-api.alp.uptn.io/v1/app/rpc");
        this.contract = new ethers_1.ethers.Contract("0x47641862F87f7f542f7c06B7EFEd656ba73E8b5d", Forwarder_json_1.default.abi, this.uptnRpcProvider);
        this.dataSigner = signer;
    }
    async gsnTransact(contractAddress, calldata, signer) {
        console.log(await signer.getAddress());
        const gas = 4000000n;
        const gsnTransactData = {
            types: {
                Message: [
                    { name: "from", type: "address" },
                    { name: "to", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "gas", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "data", type: "bytes" },
                    { name: "validUntilTime", type: "uint256" },
                    { name: "SKPlanetUPTNPlatformGSN", type: "bytes32" },
                ],
            },
            primaryType: "Message",
            domain: {
                name: "UPTN Platform",
                version: "1",
                chainId: 6118,
                verifyingContract: "0x47641862F87f7f542f7c06B7EFEd656ba73E8b5d",
            },
            message: {
                data: "",
                from: "",
                to: "",
                gas: "",
                nonce: "",
                validUntilTime: String("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
                value: String("0x0"),
                SKPlanetUPTNPlatformGSN: "0x" +
                    Buffer.from("bytes32 SKPlanetUPTNPlatformGSN)", "utf8").toString("hex"),
            },
        };
        gsnTransactData.message.to = contractAddress;
        gsnTransactData.message.data = calldata;
        gsnTransactData.message.from = await signer.getAddress();
        gsnTransactData.message.gas = (0, ethers_1.toBeHex)(gas);
        gsnTransactData.message.nonce = (0, ethers_1.toBeHex)(await this.getNonceFromForwarder(await signer.getAddress()));
        const signature = await signer.signTypedData(gsnTransactData.domain, gsnTransactData.types, gsnTransactData.message);
        const tx = {
            forwardRequest: gsnTransactData,
            metadata: {
                signature: signature.substring(2),
            },
        };
        const rawTx = "0x" + Buffer.from(JSON.stringify(tx)).toString("hex");
        console.log(JSON.stringify(tx, null, 2));
        console.log("rawTx", rawTx);
        const resultJson = await this.gsnRpcGatewayProvider.send("eth_sendRawTransaction", [rawTx]);
        const txHash = resultJson;
        const txResponse = await this.gsnRpcGatewayProvider.getTransaction(txHash);
        return txResponse;
    }
    async getNonceFromForwarder(fromAddress) {
        const nonce = await this.contract.getNonce(fromAddress);
        return nonce;
    }
}
exports.SkpGSN = SkpGSN;
//# sourceMappingURL=gsn.js.map