"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const PlaydappService_json_1 = __importDefault(require("./PlaydappService.json"));
const PlaydappDropsMinter_json_1 = __importDefault(require("./PlaydappDropsMinter.json"));
class Web3LibraryImpl {
    CHAIN_WATCH_RETRY_LIMIT = 5;
    EVENT_WATCH_LIMIT_COUNT = 30;
    EVENT_WATCH_INTERVAL = 5000;
    RETRY_LIMIT = 10;
    MAX_GAS_PRICE = 10000;
    web3;
    constructor() {
        const provider = "https://polygon-rpc.com";
        const pk = "7f123293e3f53013b886e97771bc7ac0a0aace3376722ba3e005579aa7dc4d7b";
        this.web3 = new web3_1.default(provider);
        const account = this.web3.eth.accounts.privateKeyToAccount(`0x${pk}`);
        this.web3.eth.accounts.wallet.add(account);
    }
    getContract() {
        const contract = new this.web3.eth.Contract(PlaydappService_json_1.default.abi, "0xc9C9e9Acd4dEE1099060f0360F852b1AAe896447", { from: "0x2Ae871fB644F1123560b471bd96eFb016b21b9FA" });
        return contract;
    }
    getMinterContract() {
        const contract = new this.web3.eth.Contract(PlaydappDropsMinter_json_1.default.abi, "0x7FF502d7e68DeBC4354B2B09B63046d748624d50", { from: "0x2Ae871fB644F1123560b471bd96eFb016b21b9FA" });
        return contract;
    }
    async sendMethod(method, from, txHashCb) {
        return new Promise((resolve, reject) => {
            const txData = {
                from,
            };
            this.web3.eth.defaultAccount = from;
            this.web3.eth.getTransactionCount(this.web3.eth.defaultAccount, 'pending')
                .then((nonce) => {
                txData.nonce = nonce;
                return method.estimateGas(txData);
            })
                .then((gasEstimation) => {
                txData.gas = gasEstimation;
            })
                .then((gas) => {
                const gasPrice = 130;
                txData.gasPrice = this.web3.utils.toWei(gasPrice.toString(), 'gwei');
                method.send(txData)
                    .on('transactionHash', (hash) => {
                    console.log(method._method.name, hash);
                    if (txHashCb)
                        txHashCb(hash);
                })
                    .on('receipt', (receipt) => {
                    resolve(receipt);
                })
                    .on('error', async (err) => {
                    console.log(err);
                    if (err.message.includes('replacement transaction underpriced')
                        || err.message.includes('already known')
                        || err.message.includes('nonce too low')) {
                        console.log('duplicate transaction hash. retry...');
                        try {
                            const retry = await this.sendMethod(method, from, txHashCb);
                            return resolve(retry);
                        }
                        catch (error) {
                            return reject(error);
                        }
                    }
                    reject(err);
                });
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
}
exports.default = Web3LibraryImpl;
//# sourceMappingURL=Web3LibraryImpl.js.map