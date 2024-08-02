import { cmpData } from "./cmp-data";
import { origin } from "./origin-data";
import { pdmpData } from "./pdmp-data";

enum Chain {
  UptnDev = "uptn-dev",
  UptnAlpha = "uptn-alpha",
  Uptn = "uptn",
}

const chainToChainId: { [key in Chain]: number } = {
  [Chain.UptnDev]: 6116,
  [Chain.UptnAlpha]: 6118,
  [Chain.Uptn]: 6119,
};

export const parseForPDMP = async () => {
  const chain = process.argv[2] as Chain;
  const chainId = chainToChainId[chain];

  const pdmpAddresses = new Set(
    pdmpData.map((address) => address.toLowerCase())
  );

  const newContracts = origin.flatMap((category) =>
    category.contractList.filter(
      (contract) =>
        contract.chainId === chainId &&
        !pdmpAddresses.has(contract.contractAddress.toLowerCase())
    )
  );

  const queryData = newContracts
    .map(
      (contract) =>
        `(null, N'erc721', N'${contract.contractName}', N'${
          contract.contractAddress
        }', N'OpenSea', N'${
          chain === Chain.UptnAlpha ? "uptn_alpha" : "uptn"
        }', 2.500, 2.500, null, GETDATE(), GETDATE())`
    )
    .join(",\n");

  console.log(queryData);
};

export const parseForCMP = async () => {
  const chain = process.argv[2] as Chain;
  const chainId = chainToChainId[chain];

  const cmpAddresses = new Set(cmpData.map((address) => address.toLowerCase()));

  const newContracts = origin.flatMap((category) =>
    category.contractList
      .filter(
        (contract) =>
          contract.chainId === chainId &&
          !cmpAddresses.has(contract.contractAddress.toLowerCase())
      )
      .map((contract) => ({
        ...contract,
        categoryCode: category.nfpcCd,
      }))
  );

  const getCategoryNumber = (categoryCode: string) => {
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
    .map(
      (contract) =>
        `(${getCategoryNumber(contract.categoryCode)}, '${
          contract.contractName
        }', 'erc721', '${
          contract.contractAddress
        }', 'uptn'::public.asset_network_enum)`
    )
    .join(",\n");

  console.log(queryData);
};
