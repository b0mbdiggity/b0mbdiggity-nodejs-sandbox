import { MetadataOutput, MintResult } from './metadata';
export declare class PlayzV2Metadata {
    static names: string[];
    characterIdx: number;
    grade: string;
    tokenId: string;
    mintedAt: number;
    txHash?: string;
    x?: number;
    y?: number;
    owner?: string;
    constructor(characterIdx: number, grade: string, tokenId: string, mintedAt: number, txHash?: string, x?: number, y?: number, owner?: string);
    parseMetadata(): MetadataOutput;
    parseMintResult(): MintResult;
    toObject(): Object;
}
