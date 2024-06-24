import { BigNumberish } from "ethers";
import type { OrderV2 } from "./orders/types";
import { Forwarder as ForwarderContract } from "./typechain/contracts";
export type { ForwarderContract };
export declare enum EventType {
    TransactionCreated = "TransactionCreated",
    TransactionConfirmed = "TransactionConfirmed",
    TransactionDenied = "TransactionDenied",
    TransactionFailed = "TransactionFailed",
    WrapEth = "WrapEth",
    UnwrapWeth = "UnwrapWeth",
    MatchOrders = "MatchOrders",
    CancelOrder = "CancelOrder",
    ApproveOrder = "ApproveOrder",
    Transfer = "Transfer"
}
export interface EventData {
    accountAddress?: string;
    amount?: BigNumberish;
    transactionHash?: string;
    event?: EventType;
    error?: unknown;
    orderV2?: OrderV2;
}
export interface XmarketAPIConfig {
    chain?: Chain;
    apiKey?: string;
    apiBaseUrl?: string;
}
export declare enum Chain {
    Mainnet = "ethereum",
    Polygon = "matic",
    Klaytn = "klaytn",
    Base = "base",
    BNB = "bsc",
    Arbitrum = "arbitrum",
    ArbitrumNova = "arbitrum_nova",
    Avalanche = "avalanche",
    Optimism = "optimism",
    Solana = "solana",
    Zora = "zora",
    Uptn = "uptn",
    Goerli = "goerli",
    Sepolia = "sepolia",
    Mumbai = "mumbai",
    Baobab = "baobab",
    BaseSepolia = "base_sepolia",
    BNBTestnet = "bsctestnet",
    ArbitrumSepolia = "arbitrum_sepolia",
    Fuji = "avalanche_fuji",
    OptimismSepolia = "optimism_sepolia",
    SolanaDevnet = "soldev",
    ZoraSepolia = "zora_sepolia",
    UptnDevnet = "uptn_devnet"
}
export declare enum OrderSide {
    ASK = "ask",
    BID = "bid"
}
export declare enum TokenStandard {
    ERC20 = "ERC20",
    ERC721 = "ERC721",
    ERC1155 = "ERC1155"
}
export declare enum SafelistStatus {
    NOT_REQUESTED = "not_requested",
    REQUESTED = "requested",
    APPROVED = "approved",
    VERIFIED = "verified",
    DISABLED_TOP_TRENDING = "disabled_top_trending"
}
export interface Fee {
    fee: number;
    recipient: string;
    required: boolean;
}
export interface Asset {
    tokenId: string | null;
    tokenAddress: string;
    tokenStandard?: TokenStandard;
    name?: string;
    decimals?: number;
}
export interface AssetWithTokenId extends Asset {
    tokenId: string;
}
export interface AssetWithTokenStandard extends Asset {
    tokenStandard: TokenStandard;
}
interface XmarketCollectionStatsIntervalData {
    interval: "one_day" | "seven_day" | "thirty_day";
    volume: number;
    volume_diff: number;
    volume_change: number;
    sales: number;
    sales_diff: number;
    average_price: number;
}
export interface XmarketCollectionStats {
    total: {
        volume: number;
        sales: number;
        average_price: number;
        num_owners: number;
        market_cap: number;
        floor_price: number;
        floor_price_symbol: string;
    };
    intervals: XmarketCollectionStatsIntervalData[];
}
export interface RarityStrategy {
    strategyId: string;
    strategyVersion: string;
    calculatedAt: string;
    maxRank: number;
    tokensScored: number;
}
export interface XmarketCollection {
    name: string;
    collection: string;
    description: string;
    imageUrl: string;
    bannerImageUrl: string;
    owner: string;
    safelistStatus: SafelistStatus;
    category: string;
    isDisabled: boolean;
    isNSFW: boolean;
    traitOffersEnabled: boolean;
    collectionOffersEnabled: boolean;
    xmarketUrl: string;
    projectUrl: string;
    wikiUrl: string;
    discordUrl: string;
    telegramUrl: string;
    twitterUsername: string;
    instagramUsername: string;
    contracts: {
        address: string;
        chain: Chain;
    }[];
    editors: string[];
    fees: Fee[];
    rarity: RarityStrategy | null;
    paymentTokens: XmarketPaymentToken[];
    totalSupply: number;
    createdDate: string;
}
export interface XmarketPaymentToken {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
    chain: Chain;
    imageUrl?: string;
    ethPrice?: string;
    usdPrice?: string;
}
export interface XmarketPaymentTokensQuery {
    symbol?: string;
    address?: string;
    limit?: number;
    next?: string;
}
export interface XmarketAccount {
    address: string;
    username: string;
    profileImageUrl: string;
    bannerImageUrl: string;
    website: string;
    socialMediaAccounts: SocialMediaAccount[];
    bio: string;
    joinedDate: string;
}
export interface SocialMediaAccount {
    platform: string;
    username: string;
}
