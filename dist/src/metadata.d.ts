/// <reference types="node" />
export declare const METADATA_PROGRAM_ID: string;
export declare const METADATA_PREFIX = "metadata";
export type StringPublicKey = string;
export declare enum MetadataKey {
    Uninitialized = 0,
    MetadataV1 = 4,
    EditionV1 = 1,
    MasterEditionV1 = 2,
    MasterEditionV2 = 6,
    EditionMarker = 7
}
declare class Creator {
    address: StringPublicKey;
    verified: boolean;
    share: number;
    constructor(args: {
        address: StringPublicKey;
        verified: boolean;
        share: number;
    });
}
declare class Data {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Creator[] | null;
    constructor(args: {
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
        creators: Creator[] | null;
    });
}
declare class Metadata {
    key: MetadataKey;
    updateAuthority: StringPublicKey;
    mint: StringPublicKey;
    data: Data;
    primarySaleHappened: boolean;
    isMutable: boolean;
    editionNonce: number | null;
    masterEdition?: StringPublicKey;
    edition?: StringPublicKey;
    constructor(args: {
        updateAuthority: StringPublicKey;
        mint: StringPublicKey;
        data: Data;
        primarySaleHappened: boolean;
        isMutable: boolean;
        editionNonce: number | null;
    });
}
export declare function getMetadataAccount(tokenMint: StringPublicKey): Promise<StringPublicKey>;
export declare const decodeMetadata: (buffer: Buffer) => Metadata;
export {};
