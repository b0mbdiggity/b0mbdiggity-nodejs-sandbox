"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataType = void 0;
var MetadataType;
(function (MetadataType) {
    MetadataType["OpenSea"] = "OpenSea";
    MetadataType["PlayDapp"] = "PlayDapp";
    MetadataType["LOK"] = "LOK";
    MetadataType["Cometh"] = "COMETH";
})(MetadataType = exports.MetadataType || (exports.MetadataType = {}));
class TokenMetadata {
    network;
    tokenKey;
    content;
    lastCheck;
    tries;
    metadataType;
    constructor(network, tokenKey, content, lastCheck, tries, metadataType) {
        this.network = network;
        this.tokenKey = tokenKey;
        this.content = content;
        this.lastCheck = lastCheck;
        this.tries = tries;
        this.metadataType = metadataType;
    }
}
exports.default = TokenMetadata;
//# sourceMappingURL=TokenMetadata.js.map