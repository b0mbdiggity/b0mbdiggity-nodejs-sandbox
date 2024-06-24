"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafelistStatus = exports.TokenStandard = exports.OrderSide = exports.Chain = exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType["TransactionCreated"] = "TransactionCreated";
    EventType["TransactionConfirmed"] = "TransactionConfirmed";
    EventType["TransactionDenied"] = "TransactionDenied";
    EventType["TransactionFailed"] = "TransactionFailed";
    EventType["WrapEth"] = "WrapEth";
    EventType["UnwrapWeth"] = "UnwrapWeth";
    EventType["MatchOrders"] = "MatchOrders";
    EventType["CancelOrder"] = "CancelOrder";
    EventType["ApproveOrder"] = "ApproveOrder";
    EventType["Transfer"] = "Transfer";
})(EventType = exports.EventType || (exports.EventType = {}));
var Chain;
(function (Chain) {
    Chain["Mainnet"] = "ethereum";
    Chain["Polygon"] = "matic";
    Chain["Klaytn"] = "klaytn";
    Chain["Base"] = "base";
    Chain["BNB"] = "bsc";
    Chain["Arbitrum"] = "arbitrum";
    Chain["ArbitrumNova"] = "arbitrum_nova";
    Chain["Avalanche"] = "avalanche";
    Chain["Optimism"] = "optimism";
    Chain["Solana"] = "solana";
    Chain["Zora"] = "zora";
    Chain["Uptn"] = "uptn";
    Chain["Goerli"] = "goerli";
    Chain["Sepolia"] = "sepolia";
    Chain["Mumbai"] = "mumbai";
    Chain["Baobab"] = "baobab";
    Chain["BaseSepolia"] = "base_sepolia";
    Chain["BNBTestnet"] = "bsctestnet";
    Chain["ArbitrumSepolia"] = "arbitrum_sepolia";
    Chain["Fuji"] = "avalanche_fuji";
    Chain["OptimismSepolia"] = "optimism_sepolia";
    Chain["SolanaDevnet"] = "soldev";
    Chain["ZoraSepolia"] = "zora_sepolia";
    Chain["UptnDevnet"] = "uptn_devnet";
})(Chain = exports.Chain || (exports.Chain = {}));
var OrderSide;
(function (OrderSide) {
    OrderSide["ASK"] = "ask";
    OrderSide["BID"] = "bid";
})(OrderSide = exports.OrderSide || (exports.OrderSide = {}));
var TokenStandard;
(function (TokenStandard) {
    TokenStandard["ERC20"] = "ERC20";
    TokenStandard["ERC721"] = "ERC721";
    TokenStandard["ERC1155"] = "ERC1155";
})(TokenStandard = exports.TokenStandard || (exports.TokenStandard = {}));
var SafelistStatus;
(function (SafelistStatus) {
    SafelistStatus["NOT_REQUESTED"] = "not_requested";
    SafelistStatus["REQUESTED"] = "requested";
    SafelistStatus["APPROVED"] = "approved";
    SafelistStatus["VERIFIED"] = "verified";
    SafelistStatus["DISABLED_TOP_TRENDING"] = "disabled_top_trending";
})(SafelistStatus = exports.SafelistStatus || (exports.SafelistStatus = {}));
//# sourceMappingURL=types.js.map