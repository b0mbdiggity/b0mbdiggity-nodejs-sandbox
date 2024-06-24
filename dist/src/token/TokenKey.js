"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TokenKey {
    contractAddress;
    tokenId;
    network;
    constructor(contractAddress, tokenId, network) {
        this.contractAddress = contractAddress;
        this.tokenId = tokenId;
        this.network = network;
    }
    equals(other) {
        const networkEqual = (!this.network || !other.network) || (this.network === other.network);
        return this.contractAddress.equals(other.contractAddress) && this.tokenId === other.tokenId && networkEqual;
    }
}
exports.default = TokenKey;
//# sourceMappingURL=TokenKey.js.map