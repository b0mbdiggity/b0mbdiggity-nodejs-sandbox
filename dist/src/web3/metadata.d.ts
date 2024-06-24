export interface attribute {
    display_type?: string;
    trait_type: string;
    value: number | string;
}
export interface MetadataOutput {
    token_id: number | string;
    image: string | null;
    external_url: string | null;
    description: string | null;
    name: string | null;
    attributes: Array<attribute> | null;
}
export interface MintResult {
    txHash: string;
    tokenId: string;
    image: string;
    name: string;
    mintedAt: number;
}
export type MetadataBundle = {
    [key in string]: Array<MetadataOutput>;
};
