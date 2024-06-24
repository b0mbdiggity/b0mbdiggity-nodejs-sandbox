import { MintBehavior } from "./PlaydappERC721DTO";
import PlaydappERC721Repository from "./PlayzV2Repository";
import Web3LibraryImpl from "./Web3LibraryImpl";
import { MintResult, TokenGrade } from "./PlaydappERC721DTO";
export default class PlayzV2Token {
    private web3Lib?;
    private erc721Repository?;
    names: string[];
    constructor(web3Lib?: Web3LibraryImpl, erc721Repository?: PlaydappERC721Repository);
    mint(account: string, characterIndex: number, grade: TokenGrade, mintBehavior: MintBehavior): Promise<MintResult | null>;
}
