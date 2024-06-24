"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConnectionManager_1 = __importDefault(require("./ConnectionManager"));
const MssqlDatabase_1 = __importDefault(require("./MssqlDatabase"));
const PlaydappERC721DTO_1 = require("./web3/PlaydappERC721DTO");
const PlayzV2Repository_1 = __importDefault(require("./web3/PlayzV2Repository"));
const PlayzV2Token_1 = __importDefault(require("./web3/PlayzV2Token"));
const Web3LibraryImpl_1 = __importDefault(require("./web3/Web3LibraryImpl"));
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const ethers_1 = require("ethers");
const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
const tokenName = [
    'Tournaments Ticket',
];
const tokenAddresses = [
    '0x53532EdB41F2dbf2a3d45f71e2Ba9423Fecfd3af',
];
const tokenBaseIds = [
    '200000000',
];
const sendToListAltToken = async () => {
    const web3 = new Web3LibraryImpl_1.default();
    const files = fs_1.default.createWriteStream(`${(0, moment_1.default)().format('YYYY-MM-DD')}_result.csv`);
    files.on('error', (err) => {
        console.log((0, moment_1.default)().format('YYYY-MM-DD_file_on_error'), err);
        throw new Error();
    });
    files.write(`walletAddress,tokenId,assetName,transactionHash,error\n`);
    const airdropTargets = [];
    fs_1.default.createReadStream(`2023-01-26_airdrop.csv`)
        .pipe((0, csv_parser_1.default)())
        .on('data', async (data) => {
        airdropTargets.push({
            walletAddress: data.walletAddress.trim(),
        });
    })
        .on('end', async () => {
        console.log('Read csv done');
        for (const target of airdropTargets) {
            try {
                for (let i = 0; i < tokenAddresses.length; i++) {
                    for (let j = 0; j < 3; j++) {
                        const method = await web3.getMinterContract().methods.mintTo(tokenAddresses[i], target.walletAddress, tokenBaseIds[i]);
                        const transactionReceipt = await web3.sendMethod(method, "0x2Ae871fB644F1123560b471bd96eFb016b21b9FA");
                        const tokenId = ethers_1.BigNumber.from(transactionReceipt.events[0].raw?.topics[3]);
                        console.log(target.walletAddress, transactionReceipt.transactionHash, tokenId.toString());
                        files.write(`${target.walletAddress},${tokenName[i]},${tokenId.toString()},${transactionReceipt.transactionHash},NULL\n`);
                    }
                }
            }
            catch (e) {
                console.log(target.walletAddress, e);
                files.write(`${target.walletAddress},NULL,NULL,NULL,${JSON.stringify(e)}\n`);
            }
        }
        files.end();
    });
};
const sendToList = async () => {
    await MssqlDatabase_1.default.getInstance();
    const db = new ConnectionManager_1.default();
    await db.init();
    const repo = new PlayzV2Repository_1.default(db);
    const web3 = new Web3LibraryImpl_1.default();
    const playzv2 = new PlayzV2Token_1.default(web3, repo);
    const files = fs_1.default.createWriteStream(`${(0, moment_1.default)().format('YYYY-MM-DD')}_result.csv`);
    files.on('error', (err) => {
        console.log((0, moment_1.default)().format('YYYY-MM-DD_file_on_error'), err);
        throw new Error();
    });
    files.write(`walletAddress,tokenId,transactionHash,error\n`);
    const airdropTargets = [];
    fs_1.default.createReadStream(`2022-11-03_airdrop.csv`)
        .pipe((0, csv_parser_1.default)())
        .on('data', async (data) => {
        const temp = Object.keys(data)[0];
        airdropTargets.push({
            walletAddress: data.walletAddress.trim(),
        });
    })
        .on('end', async () => {
        console.log('Read csv done');
        let i = 0;
        for (const target of airdropTargets) {
            try {
                const result = await playzv2.mint(target.walletAddress, i % 6, PlaydappERC721DTO_1.TokenGrade.R, PlaydappERC721DTO_1.MintBehavior.EVENT);
                console.log(target.walletAddress, result);
                files.write(`${target.walletAddress},${result?.tokenId},${result?.txHash},NULL\n`);
            }
            catch (e) {
                console.log(target.walletAddress, e.message);
                files.write(`${target.walletAddress},NULL,NULL,${JSON.stringify(e)}\n`);
            }
            i += 1;
        }
        files.end();
    });
};
const sendToSingle = async () => {
    await MssqlDatabase_1.default.getInstance();
    const db = new ConnectionManager_1.default();
    await db.init();
    const repo = new PlayzV2Repository_1.default(db);
    const web3 = new Web3LibraryImpl_1.default();
    const playzv2 = new PlayzV2Token_1.default(web3, repo);
    const result = await playzv2.mint('0x13564b235c7097e1ed0722bf18922fd0175fb317', 4, PlaydappERC721DTO_1.TokenGrade.SSR, PlaydappERC721DTO_1.MintBehavior.EVENT);
    console.log(result);
};
sendToListAltToken();
//# sourceMappingURL=airdrop.js.map