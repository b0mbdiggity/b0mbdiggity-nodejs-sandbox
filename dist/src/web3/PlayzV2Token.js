"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlaydappERC721DTO_1 = __importDefault(require("./PlaydappERC721DTO"));
class PlayzV2Token {
    web3Lib;
    erc721Repository;
    names = ["MIKEY", "PEPPA", "TWINKY", "BRAM", "LANCE", "HIKIMO"];
    constructor(web3Lib, erc721Repository) {
        this.web3Lib = web3Lib;
        this.erc721Repository = erc721Repository;
    }
    async mint(account, characterIndex, grade, mintBehavior) {
        try {
            const method = await this.web3Lib.getContract().methods.ownerMintTo(account, "0xc58C5A1c29fcC53e3041D5f889dEA9cE683B3a3C");
            if (method) {
                const transactionReceipt = await this.web3Lib.sendMethod(method, "0x2Ae871fB644F1123560b471bd96eFb016b21b9FA");
                const eventLog = transactionReceipt?.events
                    ? transactionReceipt.events["PlaydappNFTMint"]
                    : undefined;
                if (eventLog) {
                    const erc721DTO = new PlaydappERC721DTO_1.default(eventLog.returnValues.tokenId.toString(), characterIndex, grade, mintBehavior, transactionReceipt.transactionHash);
                    const metadata = await this.erc721Repository.insertMetadata(erc721DTO);
                    return metadata.parseMintResult();
                }
            }
        }
        catch (error) {
            console.log(error);
        }
        return null;
    }
}
exports.default = PlayzV2Token;
//# sourceMappingURL=PlayzV2Token.js.map