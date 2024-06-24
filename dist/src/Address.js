"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const class_validator_1 = require("class-validator");
const web3_utils_1 = require("web3-utils");
class Address {
    value;
    static nullAddress = new Address('0x0000000000000000000000000000000000000000');
    constructor(value) {
        if ((0, class_validator_1.isEthereumAddress)(value)) {
            this.value = (0, web3_utils_1.toChecksumAddress)(value);
        }
        else {
            this.value = value;
        }
    }
    changeForm(withPrefix = true, withCheckSum = true) {
        const checkSumApplied = withCheckSum ? this.value : this.value.toLowerCase();
        return withPrefix ? checkSumApplied : checkSumApplied.slice(2);
    }
    equals(address) {
        return this.value === address.value;
    }
    isSolanaAddress() {
        return this.isBase58(this.value) && web3_js_1.PublicKey.isOnCurve(this.value);
    }
    isBase58(value) {
        return /^[A-HJ-NP-Za-km-z1-9]{32,44}$/.test(value);
    }
}
exports.default = Address;
//# sourceMappingURL=Address.js.map