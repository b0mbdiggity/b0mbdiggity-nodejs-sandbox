"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Token {
    network;
    owner;
    key;
    ownedTime;
    constructor(network, key, owner, ownedTime) {
        this.network = network;
        this.key = key;
        this.owner = owner;
        this.ownedTime = ownedTime;
    }
}
exports.default = Token;
//# sourceMappingURL=Token.js.map