"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = require("mssql");
const moment_1 = __importDefault(require("moment"));
const PlayzV2Metadata_1 = require("./PlayzV2Metadata");
class PlayzV2MSSQLRepository {
    db;
    numberOfCharacterIndex = 6;
    constructor(connectionManager) {
        this.db = connectionManager;
    }
    async insertMetadata(erc721DTO) {
        const query = `
      INSERT INTO nft_playz_v2_token_metadata
        (
          [token_id],
          [character_idx],
          [grade],
          [tx_hash],
          [minted_at],
          [payment]
        )
      OUTPUT
        Inserted.token_id as tokenId,
        Inserted.character_idx as characterIdx,
        Inserted.grade,
        Inserted.tx_hash as txHash,
        Inserted.minted_at as mintedAt
      VALUES
        (
          @tokenId,
          @characterIdx,
          @grade,
          @txHash,
          @mintedAt,
          @payment
        )
    `;
        const inputParams = {
            tokenId: {
                value: erc721DTO.tokenId,
                type: mssql_1.TYPES.Int,
            },
            characterIdx: {
                value: erc721DTO.characterIdx,
                type: mssql_1.TYPES.TinyInt,
            },
            grade: {
                value: erc721DTO.grade,
                type: mssql_1.TYPES.VarChar,
            },
            txHash: {
                value: erc721DTO.txHash,
                type: mssql_1.TYPES.VarChar,
            },
            mintedAt: {
                value: (0, moment_1.default)().unix(),
                type: mssql_1.TYPES.Int,
            },
            payment: {
                value: erc721DTO.mintBehaviorType,
                type: mssql_1.TYPES.VarChar,
            },
        };
        const result = (await this.db.prepareExcute({
            query,
            inputParams,
        }))[0];
        return new PlayzV2Metadata_1.PlayzV2Metadata(result.characterIdx, result.grade, result.tokenId.toString(), result.mintedAt, result.txHash);
    }
}
exports.default = PlayzV2MSSQLRepository;
//# sourceMappingURL=PlayzV2Repository.js.map