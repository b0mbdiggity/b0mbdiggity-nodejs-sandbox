"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseForCMP = exports.parseForPDMP = void 0;
const cmp_data_1 = require("./cmp-data");
const origin_data_1 = require("./origin-data");
const pdmp_data_1 = require("./pdmp-data");
var Chain;
(function (Chain) {
    Chain["UptnDev"] = "uptn-dev";
    Chain["UptnAlpha"] = "uptn-alpha";
    Chain["Uptn"] = "uptn";
})(Chain || (Chain = {}));
const chainToChainId = {
    [Chain.UptnDev]: 6116,
    [Chain.UptnAlpha]: 6118,
    [Chain.Uptn]: 6119,
};
const parseForPDMP = async () => {
    const chain = process.argv[2];
    const chainId = chainToChainId[chain];
    const pdmpAddresses = new Set(pdmp_data_1.pdmpData.map((address) => address.toLowerCase()));
    const newContracts = origin_data_1.origin.flatMap((category) => category.contractList.filter((contract) => contract.chainId === chainId &&
        !pdmpAddresses.has(contract.contractAddress.toLowerCase())));
    const queryData = newContracts
        .map((contract) => `(null, N'erc721', N'${contract.contractName}', N'${contract.contractAddress}', N'OpenSea', N'${chain === Chain.UptnAlpha ? "uptn_alpha" : "uptn"}', 2.500, 2.500, null, GETDATE(), GETDATE())`)
        .join(",\n");
    console.log(queryData);
};
exports.parseForPDMP = parseForPDMP;
const parseForCMP = async () => {
    const chain = process.argv[2];
    const chainId = chainToChainId[chain];
    const cmpAddresses = new Set(cmp_data_1.cmpData.map((address) => address.toLowerCase()));
    const newContracts = origin_data_1.origin.flatMap((category) => category.contractList
        .filter((contract) => contract.chainId === chainId &&
        !cmpAddresses.has(contract.contractAddress.toLowerCase()))
        .map((contract) => ({
        ...contract,
        categoryCode: category.nfpcCd,
    })));
    const getCategoryNumber = (categoryCode) => {
        switch (categoryCode) {
            case "NFPC001":
                return 1;
            case "NFPC002":
                return 2;
            case "NFPC003":
                return 3;
            case "NFPC004":
                return 5;
            default:
                return 0;
        }
    };
    const queryData = newContracts
        .map((contract) => `(${getCategoryNumber(contract.categoryCode)}, '${contract.contractName}', 'erc721', '${contract.contractAddress}', 'uptn'::public.asset_network_enum)`)
        .join(",\n");
    console.log(queryData);
};
exports.parseForCMP = parseForCMP;
//# sourceMappingURL=uptn-asset.js.map