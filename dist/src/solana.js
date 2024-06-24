"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3 = __importStar(require("@solana/web3.js"));
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const assets = [
    "AN7jf7vivqBEudAVhE12pmBmzQRi4TyuujX4aLzEGwQt",
    "HCGJ4L2aF7NPRmJX2kkcEWH7CK61AdhvoLUnGAtpcTwY",
    "FL8Vk1noL79m1FfX55H1oudisfFzpsAxJz9r2eZEkWqi",
    "6GQfZUbr7XEyRsaTNKaB1BXzKkJyZ96sBTmeanrBE73i",
    "7W2kg5crExHWWwD14DRTiShmzZydYBXRGDLSYwvuWJEm",
    "HL4NW4jMsHV4tEuXscK3y3BsjgTjJKw1NdxyxkMhuMxb"
];
const add = [];
(async () => {
    var connection = new web3.Connection('https://solana-mainnet.g.alchemy.com/v2/-MvLZ0M_39F0oBH-JnZLM3gp0wFERL9h', "confirmed");
    const sigs = (await connection.getSignaturesForAddress(new web3.PublicKey('CwCyfEscBiVjTwUcPnLhcPP3urGTXCGvJnk4sjgMbBfm'))).concat(add.map((e) => ({ signature: e })));
    console.log('total >>', sigs.length);
    let i = 0;
    const files = fs_1.default.createWriteStream(`${(0, moment_1.default)().format('YYYY-MM-DD')}_ipx_mint_gas_fee.csv`);
    files.on('error', (err) => {
        console.log((0, moment_1.default)().format('YYYY-MM-DD_file_on_error'), err);
        throw new Error();
    });
    files.write(`datetime,signature(transactionHash),pre balance(SOL), post balance(SOL),total fee(SOL)\n`);
    for (const sig of sigs) {
        try {
            const detail = await connection.getParsedTransaction(sig.signature);
            const signers = detail?.transaction.message.accountKeys.filter((e) => e.signer);
            const signer = signers?.find((e) => e.pubkey.toBase58() === '8uvkZZj6oB8voN3chwE1quMkivCoky9GHPSx3sToJ5Hp');
            if (!signer) {
                console.log('not match signer');
                continue;
            }
            let fee = 0;
            const preBalance = detail?.meta?.preBalances[0];
            const postBalance = detail?.meta?.postBalances[0];
            fee = preBalance - postBalance;
            files.write(`${moment_1.default.unix(detail?.blockTime).format('YYYY-MM-DD HH:mm:ss')},${sig.signature},${preBalance / web3.LAMPORTS_PER_SOL},${postBalance / web3.LAMPORTS_PER_SOL},${fee / web3.LAMPORTS_PER_SOL}\n`);
            console.log('sig >>', sig.signature);
            console.log('fee >>', fee);
            console.log(i + ("-").repeat(20));
        }
        catch (e) {
            console.log(e);
            files.write(`${sig.signature},${0},${0},${e}\n`);
        }
        i++;
    }
    files.end();
})();
//# sourceMappingURL=solana.js.map