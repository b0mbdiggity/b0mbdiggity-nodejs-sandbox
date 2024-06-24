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
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const mpl = __importStar(require("@metaplex-foundation/mpl-token-metadata"));
const splToken = __importStar(require("@solana/spl-token"));
const anchor = __importStar(require("@project-serum/anchor"));
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("mainnet-beta"), 'confirmed');
const bs58 = require("bs58");
const secretKey = bs58.decode("2cdRob2r4P9B6n3BvdHZUVawvqNduSFwQ9sH8pjryrmw9d3bHBoTnJN3QBasLEUK2XKjFzo7ccyLkAaqv2sTdzo8");
const tokenAddresses = [
    '5JEqwWEUAWMnKgQagM9pUskDNWm1ZpbBRNvDqc6tQNuN',
    'Eq8zzXd8iiY8zwr6abJ1xA6T5LJJUDSFYzzENVfjJKGi',
    '143EdChhufv4fN8ckURma7DN1XizarvuXutoKWFGWZcd',
    '84cUX4yz1awRXukKDVHaCAkNkNmbHm3eFVCQ4y41UEDE',
    '3ZZRzXnSQ8sq3NyfDZMPSes2gkrFMpKqWJ4Xieyan64m',
    '4MPE6QaZ6UiZfjUykZjcx2ELAe8bHY2ybryhhWRRtn9M',
    '8fWo4aWQRXQJaKXJmsnTAiAdHCNqrEff7pbuDWK3pLyD',
    '4uCY17onZ33ryieYbyTEXjDvxRDm5JfzF6jx4AJDxyRa',
    'A3Ms91QE8KjGvgYv8NY3FQApVrpyEqvwWcV1UdegsC1N',
    'GwdmktYT4d2bzh7JwWQVRknK2eicTrtnjmdNPw9Ey1By',
    'CWb4Fv2ek5wsqj7mDEWhrAtASKzRXYFrDSyBSq5LKuiG',
    'AL7h9MVhWDnDnGmeuHw6HCCwVF2qf4DNbSpcujCKFugV',
    'A3YXMyJ66bgGLCK9H2gxDxS9epEeKuCPK5SExZG9VVBy',
    'AbuYTeJga79aM6Ty28o7VfepBakRiHFssJCWj9QCkamB',
    'M4AddPHBx2LmUPFWjMjk1nz8FxoGB91mYG4XD6NB4Eu',
    '2MdVkUi8jQr6XTzqLfZSh6uGwKBT4sQVddAgYpmiLXDy',
    'CMKPzfvtmY3d8jdsPxh4AbjJwEa5JN2S9CQ9jfsneQE1',
    'eYUmLfHzTyPSRTEksygRov9hMX4UvHUpfMhxfJVbdR4',
    'JASqKobBLj2t9LnVfNhWuHMuytV2hJJsQHasSrEBbkE3',
    '698HWtMA4LNBkmoiUWYLM87HwxYXmsvKTebgEgB6EwHP',
    '6wguzNb3CqTot5yYBgcjEQvF9zWY5siMfCTZcH1BMWqg',
    '5LZeZKf7ZnBvkUkLPC4d5BaRs1ArS5fYr5bZVBbGDpjG',
    'Ho5qBHomveUNJxM6jk7yA3SB8HsDwcoPxWHiRwjRwsj3',
    '8DWhwrYky8KHMY2Gag25S5QhQdwENXCjRgG7WK4FtFEa',
    'FL2DbNzbh63bH2x37dMH3smpAAposKUTUSiqxd18EZm5',
];
const COLLECTION_MINT = "ACth3kBh6hXC2T8mPSYzq1BswNjkCCBTYxbeqXDNpbew";
const burnThatNFT = async (tokenAddress) => {
    try {
        const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
        const mint = new web3_js_1.PublicKey(tokenAddress);
        const collectionMint = new web3_js_1.PublicKey(COLLECTION_MINT);
        const ta = await splToken.getAssociatedTokenAddress(mint, keypair.publicKey);
        const seed1 = Buffer.from(anchor.utils.bytes.utf8.encode("metadata"));
        const seed2 = Buffer.from(mpl.PROGRAM_ID.toBytes());
        const seed3 = Buffer.from(mint.toBytes());
        const seed4 = Buffer.from(anchor.utils.bytes.utf8.encode("edition"));
        const [metadataPDA, _bump] = web3_js_1.PublicKey.findProgramAddressSync([seed1, seed2, seed3], mpl.PROGRAM_ID);
        const [masterEditionPDA, _bump2] = web3_js_1.PublicKey.findProgramAddressSync([seed1, seed2, seed3, seed4], mpl.PROGRAM_ID);
        const [collectionMetadataPDA, _bump3] = web3_js_1.PublicKey.findProgramAddressSync([seed1, seed2, Buffer.from(collectionMint.toBytes())], mpl.PROGRAM_ID);
        console.log("owner: " + keypair.publicKey.toBase58());
        console.log("mint: " + mint.toBase58());
        console.log("token account: " + ta.toBase58());
        console.log("metadata account: " + metadataPDA.toBase58());
        console.log("edition account: " + masterEditionPDA.toBase58());
        console.log("collection account: " + collectionMetadataPDA.toBase58());
        const brnAccounts = {
            metadata: metadataPDA,
            owner: keypair.publicKey,
            mint: mint,
            tokenAccount: ta,
            masterEditionAccount: masterEditionPDA,
            splTokenProgram: splToken.TOKEN_PROGRAM_ID,
            collectionMetadata: collectionMetadataPDA
        };
        const binstr = mpl.createBurnNftInstruction(brnAccounts, new web3_js_1.PublicKey(mpl.PROGRAM_ADDRESS));
        const transaction = new web3_js_1.Transaction().add(binstr);
        const txid = await connection.sendTransaction(transaction, [keypair]);
        console.log(txid);
    }
    catch (e) {
        console.log(e);
    }
};
const run = async () => {
    for (const address of tokenAddresses) {
        await burnThatNFT(address);
    }
};
run();
//# sourceMappingURL=solanaNftBurn.js.map