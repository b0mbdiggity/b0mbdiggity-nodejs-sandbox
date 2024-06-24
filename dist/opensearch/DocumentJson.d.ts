export default interface DocumentJSON {
    owner: string | null;
    tokenId: string | null;
    network: string | null;
    assetAddress: string | null;
    assetId: number | null;
    assetTitle: string | null;
    name: string | null;
    imageUri: string | null;
    lastTransferredAt: number | null;
    isInBundle: boolean;
    attributes: {
        [key: string]: any;
    };
    order: {
        auction: {
            minBidPrice: number | null;
            minBidCurrency?: string | null;
            highestBidPrice: number | null;
            highestBidCurrency?: string | null;
            createdAt: number | null;
            expireAt: number | null;
        } | null;
        sale: {
            price: number | null;
            currency?: string | null;
            createdAt: number | null;
        } | null;
        offer: {
            offerTotalCount: number | null;
            highestOfferPrice: number | null;
            highestOfferCurrency?: string | null;
            highestOfferCreatedAt: number | null;
        } | null;
        lastSoldInfo: {
            price: number | null;
            currency: string | null;
            soldAt: number | null;
        } | null;
    };
}
