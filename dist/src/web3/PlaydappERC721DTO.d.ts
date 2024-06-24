export declare enum MintBehavior {
    CODES = "CODES",
    MERGE = "MERGE",
    SALE = "SALE",
    BRIDGE = "BRIDGE",
    EVENT = "EVENT"
}
export declare enum TokenGrade {
    R = "R",
    SR = "SR",
    SSR = "SSR"
}
export interface MintResult {
    txHash: string;
    tokenId: string;
    image: string;
    name: string;
    mintedAt: number;
}
declare class PlaydappERC721DTO {
    readonly tokenId: string;
    readonly characterIdx: number;
    readonly grade: string;
    readonly mintBehaviorType: string;
    readonly txHash: string;
    constructor(tokenId: string, characterIdx: number, grade: TokenGrade, mintBehaviorType: MintBehavior, txHash: string);
}
export default PlaydappERC721DTO;
