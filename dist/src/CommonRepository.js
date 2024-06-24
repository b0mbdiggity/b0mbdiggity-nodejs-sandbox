"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const mssql_1 = require("mssql");
const Address_1 = __importDefault(require("./Address"));
const Config_1 = require("./Config");
const MarketPaymentLog_1 = __importDefault(require("./token/MarketPaymentLog"));
const TokenKey_1 = __importDefault(require("./token/TokenKey"));
const TokenTransferEvent_1 = __importDefault(require("./token/TokenTransferEvent"));
const BUFFER_TIME_SECOND = -10;
class CommonRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async getLastSyncTime() {
        const query = `
    SELECT last_sync_time
    FROM service_variable
    `;
        const result = await this.db.prepareExcute({
            query,
        });
        return result[0].last_sync_time;
    }
    getTokenEvents = async (time) => {
        const query = `
        SELECT TOP 1000
              ETL.network,
              ETL.[address],
              ETL.from_address,
              ETL.to_address,
              ETL.token_id,
              ETL.block_number,
              ETL.block_hash,
              ETL.block_timestamp,
              ETL.transaction_hash,
              ETL.transaction_from,
              ETL.transaction_to,
              ETL.log_index,
              ETL.inserted_at,
              ETL.modified_at,
              BTRL.data,
              BT.address as currencyAddress,
              BT2.address as currencyAddress2
        FROM blockchain_erc721_transfer_logs ETL WITH(NOLOCK)
        OUTER APPLY (
            select [data] from blockchain_transaction_receipt_logs BTRL where ETL.transaction_hash = BTRL.transaction_hash AND BTRL.topic0 = CONVERT(varbinary(max), 'c4109843e0b7d514e4c093114b863f8e7d8d9a458c372cd51bfe526b588006c9', 2)
        ) BTRL
        OUTER APPLY (
            select TOP 1 BTRL.address from blockchain_transaction_receipt_logs BTRL
            inner join blockchain_transactions BT on BT.transaction_hash = BTRL.transaction_hash and BT.[input] like '0xab834bab%'
            where ETL.transaction_hash = BTRL.transaction_hash and BTRL.address in (
                '0x8765f05adce126d70bcdf1b0a48db573316662eb',
                '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                '0x3a4f40631a4f906c2BaD353Ed06De7A5D3fCb430',
                '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
            )
        ) BT
        OUTER APPLY (
            select TOP 1 BTRL.address from blockchain_transaction_receipt_logs BTRL
            inner join blockchain_transactions BT on BT.transaction_hash = BTRL.transaction_hash and BT.[input] like '0xab834bab%'
            where ETL.transaction_hash = BTRL.transaction_hash and BTRL.address in (
                '0x0000000000000000000000000000000000001010'
            )
        ) BT2
      	where block_timestamp <= @time
        order by block_timestamp desc
    `;
        const inputParams = {
            time: {
                value: time.toISOString(),
                type: mssql_1.TYPES.DateTime,
            },
        };
        const result = await this.db.prepareExcute({
            query,
            inputParams,
        });
        return result.map((data) => new TokenTransferEvent_1.default(data.network, new TokenKey_1.default(new Address_1.default(data.address), data.token_id, data.network), new Address_1.default(data.from_address), new Address_1.default(data.to_address), BigInt(data.block_number), `0x${data.block_hash.toString('hex')}`, (0, moment_1.default)(data.block_timestamp), `0x${data.transaction_hash.toString('hex')}`, new Address_1.default(data.transaction_from), new Address_1.default(data.transaction_to), data.log_index, data.data ? new MarketPaymentLog_1.default(data.currencyAddress ?? data.currencyAddress2, data.data, (0, moment_1.default)(data.block_timestamp)) : undefined));
    };
    getTokenEventsDesc = async (time) => {
        const query = `
        SELECT TOP 1000
              ETL.network,
              ETL.[address],
              ETL.from_address,
              ETL.to_address,
              ETL.token_id,
              ETL.block_number,
              ETL.block_hash,
              ETL.block_timestamp,
              ETL.transaction_hash,
              ETL.transaction_from,
              ETL.transaction_to,
              ETL.log_index,
              ETL.inserted_at,
              ETL.modified_at,
              BTRL.data,
              BT.address as currencyAddress
        FROM blockchain_erc721_transfer_logs ETL WITH(NOLOCK)
        OUTER APPLY (
            select [data] from blockchain_transaction_receipt_logs BTRL where ETL.transaction_hash = BTRL.transaction_hash AND BTRL.topic0 = CONVERT(varbinary(max), 'c4109843e0b7d514e4c093114b863f8e7d8d9a458c372cd51bfe526b588006c9', 2)
        ) BTRL
        CROSS APPLY (
            select BTRL.address from blockchain_transaction_receipt_logs BTRL
            inner join blockchain_transactions BT on BT.transaction_hash = BTRL.transaction_hash and BT.[input] like '0xab834bab%'
            where ETL.transaction_hash = BTRL.transaction_hash and BTRL.address in (
                '0x0000000000000000000000000000000000001010',
                '0x8765f05adce126d70bcdf1b0a48db573316662eb',
                '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                '0x3a4f40631a4f906c2BaD353Ed06De7A5D3fCb430',
                '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
            )
        ) BT
      	where block_timestamp >= @time
        order by block_timestamp asc
    `;
        const inputParams = {
            time: {
                value: time.toISOString(),
                type: mssql_1.TYPES.DateTime,
            },
        };
        const result = await this.db.prepareExcute({
            query,
            inputParams,
        });
        return result.map((data) => new TokenTransferEvent_1.default(data.network, new TokenKey_1.default(new Address_1.default(data.address), data.token_id, data.network), new Address_1.default(data.from_address), new Address_1.default(data.to_address), BigInt(data.block_number), `0x${data.block_hash.toString('hex')}`, (0, moment_1.default)(data.block_timestamp), `0x${data.transaction_hash.toString('hex')}`, new Address_1.default(data.transaction_from), new Address_1.default(data.transaction_to), data.log_index, data.data ? new MarketPaymentLog_1.default(data.currencyAddress, data.data, (0, moment_1.default)(data.block_timestamp)) : undefined));
    };
    insertTransactionEvents = async (events) => {
        const query = `
        insert into blockchain_erc721_transfer_event
        (network, address, from_address, to_address, token_id, block_number, block_timestamp, transaction_hash, is_market, price, currency_address, type)
        values
        ${events.map((e) => {
            let type;
            if (e.marketPaymentLog) {
                type = e.marketPaymentLog.side === Config_1.OrderSide.BUY ? 'byOffer' : 'bySell';
            }
            else {
                if (e.from === Address_1.default.nullAddress) {
                    type = 'mint';
                }
                else if (e.to === Address_1.default.nullAddress) {
                    type = 'burn';
                }
                else {
                    type = 'transfer';
                }
            }
            return `('${e.network}', '${e.key.contractAddress.value}', '${e.from.value}', '${e.to.value}', '${e.key.tokenId}', ${e.blockNumber}, '${e.eventTime.toISOString()}', '${e.transactionHash}', ${e.marketPaymentLog ? 1 : 0}, ${e.marketPaymentLog ? e.marketPaymentLog.amount : 'NULL'}, ${e.marketPaymentLog ? "'" + e.marketPaymentLog.address.value + "'" : 'NULL'}, '${type}')`;
        }).join(',')}
    `;
        const result = await this.db.prepareExcute({
            query,
        });
    };
    deleteDoneTxHash = async (events) => {
        const query = `
        delete from job_txhash
        where transaction_hash in (
          ${events.map((e) => e.transactionHash).join(',')}
        )
    `;
        const result = await this.db.prepareExcute({
            query,
        });
    };
    async getOrderMatches(offset) {
        const query = `
    SELECT *
    FROM order_transaction
    ORDER BY order_id asc OFFSET ${1000 * offset} ROW FETCH NEXT 1000 ROW ONLY
    `;
        const result = await this.db.prepareExcute({
            query,
        });
        return result.map((data) => ({
            orderId: data.order_id,
            transactionHash: `0x${data.transaction_hash.toString('hex')}`,
        }));
    }
    insertOrderMatched = async (datas) => {
        const query = `
        insert into order_transaction_match
        (order_id, transaction_hash)
        values
        ${datas.map((e) => {
            return `('${e.orderId}', '${e.transactionHash}')`;
        }).join(',')}
    `;
        const result = await this.db.prepareExcute({
            query,
        });
    };
    async getTransactions(offset) {
        const query = `
    SELECT transaction_hash, input
    FROM blockchain_transactions WITH(NOLOCK)
    where input like '0xab%'
    ORDER BY transaction_hash asc OFFSET ${1000 * offset} ROW FETCH NEXT 1000 ROW ONLY
    `;
        const result = await this.db.prepareExcute({
            query,
        });
        return result.map((data) => ({
            txHash: `0x${data.transaction_hash.toString('hex')}`,
            input: data.input,
        }));
    }
    insertTransactions = async (datas) => {
        const query = `
        insert into blockchain_transactions_temp
        (transaction_hash, input)
        values
        ${datas.map((e, i) => {
            return `(@transactionHash${i}, @input${i})`;
        }).join(',')}
    `;
        const inputParams = {
            topic: {
                value: Config_1.TOPIC,
                type: mssql_1.TYPES.VarChar,
            },
        };
        datas.forEach((e, i) => {
            inputParams[`transactionHash${i}`] = { value: Buffer.from(e.txHash.slice(2), 'hex'), type: mssql_1.TYPES.VarBinary };
            inputParams[`input${i}`] = { value: e.input.toString(), type: mssql_1.TYPES.VarChar };
        });
        const result = await this.db.prepareExcute({
            query,
            inputParams,
        });
    };
    async getAliveOrders(tokenId, address, network) {
        const query = `
    SELECT *
    FROM order_tokens ot
    INNER JOIN order_alive_v2 oa on oa.order_id = ot.order_id
    WHERE token_id = @tokenId and contract_address = @address and ot.network = @network and oa.cancelled = 0 and oa.alive = 1
    `;
        const inputParams = {
            tokenId: {
                value: tokenId,
                type: mssql_1.TYPES.VarChar,
            },
            address: {
                value: address,
                type: mssql_1.TYPES.VarChar,
            },
            network: {
                value: network,
                type: mssql_1.TYPES.VarChar,
            },
        };
        const result = await this.db.prepareExcute({
            query,
            inputParams,
        });
        return result;
    }
    async getMetadata(tokenId, address, network) {
        const query = `
    SELECT metadata
    FROM blockchain_erc721_metadata
    WHERE token_id = @tokenId and contract_address = @address and network = @network
    `;
        const inputParams = {
            tokenId: {
                value: tokenId,
                type: mssql_1.TYPES.VarChar,
            },
            address: {
                value: address,
                type: mssql_1.TYPES.VarChar,
            },
            network: {
                value: network,
                type: mssql_1.TYPES.VarChar,
            },
        };
        const result = await this.db.prepareExcute({
            query,
            inputParams,
        });
        return result.length ? result[0].metadata : null;
    }
    async getTokensByOrderId(orderId) {
        const query = `
    select token_id as tokenId, contract_address as assetAddress, network from order_tokens where order_id = @orderId
    `;
        const inputParams = {
            orderId: {
                value: orderId,
                type: mssql_1.TYPES.VarChar,
            },
        };
        const result = await this.db.prepareExcute({
            query,
            inputParams,
        });
        return result;
    }
    async getTransactionEvents(lastCursor) {
        const query = `
    SELECT TOP 1000 *
    FROM blockchain_erc721_transfer_event WITH(NOLOCK)
    where concat(token_id, transaction_hash) < @lastCursor
    ORDER BY concat(token_id, transaction_hash) desc
    `;
        const inputParams = {
            lastCursor: {
                value: lastCursor,
                type: mssql_1.TYPES.VarChar,
            },
        };
        const result = await this.db.prepareExcute({
            query,
            inputParams
        });
        return result;
    }
    async getOrderEvents(lastCursor) {
        const query = `
      select top 1000 *
      from order_event oee
      cross apply (
          select
          STRING_AGG(ot.token_id, ',') as token_ids
          from order_event oe
          inner join order_tokens ot on ot.order_id = oe.order_id
          where oe.order_id = oee.order_id and oe.event_type = oee.event_type
          group by oe.order_id, oe.event_type
      ) ca
      cross apply (
          select top 1 contract_address, network from order_tokens where order_id = oee.order_id
      ) token
      cross apply (
          select top 1 price, currency_address, type from [order] where order_id = oee.order_id
      ) price
      where concat(oee.order_id, oee.event_type) < @lastCursor
      order by concat(oee.order_id, oee.event_type) desc
    `;
        const inputParams = {
            lastCursor: {
                value: lastCursor,
                type: mssql_1.TYPES.VarChar,
            },
        };
        const result = await this.db.prepareExcute({
            query,
            inputParams
        });
        return result;
    }
}
exports.default = CommonRepository;
//# sourceMappingURL=CommonRepository.js.map