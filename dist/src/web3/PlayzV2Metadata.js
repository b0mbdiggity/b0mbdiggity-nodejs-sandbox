"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayzV2Metadata = void 0;
class PlayzV2Metadata {
    static names = [
        'MIKEY',
        'PEPPA',
        'TWINKY',
        'BRAM',
        'LANCE',
        'HIKIMO',
    ];
    characterIdx;
    grade;
    tokenId;
    mintedAt;
    txHash;
    x;
    y;
    owner;
    constructor(characterIdx, grade, tokenId, mintedAt, txHash, x, y, owner) {
        this.characterIdx = characterIdx;
        this.grade = grade;
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.tokenId = tokenId;
        this.mintedAt = mintedAt;
        this.txHash = txHash;
    }
    parseMetadata() {
        return {
            token_id: this.tokenId,
            image: `https://presale-asset.playdapp.com/token_thumb/playz_${PlayzV2Metadata.names[this.characterIdx].toLowerCase()}_${this.grade.toLowerCase()}.png`,
            external_url: 'https://market.playdapp.com/',
            description: 'PlayDapp Town PLAYZ Token V2',
            name: `${PlayzV2Metadata.names[this.characterIdx]} ${this.grade}`,
            attributes: [
                {
                    trait_type: 'Base',
                    value: `${PlayzV2Metadata.names[this.characterIdx]}`,
                },
                {
                    trait_type: 'Grade',
                    value: this.grade,
                },
                {
                    display_type: 'date',
                    trait_type: 'birthday',
                    value: this.mintedAt,
                },
            ],
        };
    }
    parseMintResult() {
        return {
            tokenId: this.tokenId,
            txHash: this.txHash,
            image: `https://presale-asset.playdapp.com/token_thumb/playz_${PlayzV2Metadata.names[this.characterIdx].toLowerCase()}_${this.grade.toLowerCase()}.png`,
            name: `${PlayzV2Metadata.names[this.characterIdx]} ${this.grade}`,
            mintedAt: this.mintedAt,
        };
    }
    toObject() {
        return {
            characterIdx: this.characterIdx,
            grade: this.grade,
            tokenId: this.tokenId,
            mintedAt: this.mintedAt,
            txHash: this.txHash,
            x: this.x,
            y: this.y,
            owner: this.owner,
        };
    }
}
exports.PlayzV2Metadata = PlayzV2Metadata;
//# sourceMappingURL=PlayzV2Metadata.js.map