"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenGrade = exports.MintBehavior = void 0;
var MintBehavior;
(function (MintBehavior) {
    MintBehavior["CODES"] = "CODES";
    MintBehavior["MERGE"] = "MERGE";
    MintBehavior["SALE"] = "SALE";
    MintBehavior["BRIDGE"] = "BRIDGE";
    MintBehavior["EVENT"] = "EVENT";
})(MintBehavior = exports.MintBehavior || (exports.MintBehavior = {}));
var TokenGrade;
(function (TokenGrade) {
    TokenGrade["R"] = "R";
    TokenGrade["SR"] = "SR";
    TokenGrade["SSR"] = "SSR";
})(TokenGrade = exports.TokenGrade || (exports.TokenGrade = {}));
class PlaydappERC721DTO {
    tokenId;
    characterIdx;
    grade;
    mintBehaviorType;
    txHash;
    constructor(tokenId, characterIdx, grade, mintBehaviorType, txHash) {
        this.tokenId = tokenId;
        this.characterIdx = characterIdx;
        this.grade = grade;
        this.mintBehaviorType = mintBehaviorType;
        this.txHash = txHash;
    }
}
exports.default = PlaydappERC721DTO;
//# sourceMappingURL=PlaydappERC721DTO.js.map