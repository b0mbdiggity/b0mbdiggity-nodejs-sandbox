"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const opensearch_1 = require("@opensearch-project/opensearch");
const Config_1 = require("../Config");
const SearchDTO_1 = require("./SearchDTO");
class OpenSearchImpl {
    static client = new opensearch_1.Client(Config_1.OPENSEARCH_INFO.connection);
    db;
    constructor(db) {
        this.db = db;
    }
    static async clientReady() {
        try {
            await OpenSearchImpl.client.ping({}, { requestTimeout: 30000 });
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    index = Config_1.OPENSEARCH_INFO.index;
    bundleIndex = Config_1.OPENSEARCH_INFO.bundleIndex;
    async init() {
    }
    async requestSearch(graphqlParam) {
        await this.init();
        const { body } = await OpenSearchImpl.client.search({
            index: this.index,
            body: graphqlParam.parseSearchBodyIncludeBurn(),
            track_scores: true,
        });
        return body;
    }
    async requestSearchAfter(dto) {
        await this.init();
        const { body } = await OpenSearchImpl.client.search({
            index: this.index,
            body: dto.parseSearchAfterBody(),
            track_scores: true,
            track_total_hits: true,
        });
        return body;
    }
    async getRecord(id) {
        const param = {
            count: 1,
            from: 0,
            andOperations: [
                { key: '_id', value: id },
            ],
        };
        const searchDTO = new SearchDTO_1.SearchDTO(param);
        const result = await this.requestSearch(searchDTO);
        return result.hits?.hits[0]?._source;
    }
    async requestSearchAfterBundle(dto) {
        await this.init();
        const { body } = await OpenSearchImpl.client.search({
            index: this.bundleIndex,
            body: dto.parseSearchAfterBody(),
            track_scores: true,
            track_total_hits: true,
        });
        return body;
    }
    async getRecordsByCursor(searchAfterParam) {
        const param = {
            count: 3,
            sortBy: SearchDTO_1.SortByType.Transfer,
            sortAscending: false,
            searchAfterParam,
        };
        const searchDTO = new SearchDTO_1.SearchDTO(param);
        const searchResult = await this.requestSearchAfter(searchDTO);
        const { hits, total } = searchResult.hits;
        const result = {
            id: hits.length ? hits[hits.length - 1]._id : null,
            value: hits.length ? hits[hits.length - 1]._id : null,
            limit: 3,
            total: total.value,
            records: hits.map((item) => ({
                _id: item._id,
                ...item._source,
            })),
        };
        return result;
    }
    async getRecordsByCursorBundle(searchAfterParam) {
        const param = {
            count: 3,
            sortBy: SearchDTO_1.SortByType.Transfer,
            sortAscending: false,
            searchAfterParam,
        };
        const searchDTO = new SearchDTO_1.SearchDTO(param);
        const searchResult = await this.requestSearchAfterBundle(searchDTO);
        const { hits, total } = searchResult.hits;
        const result = {
            id: hits.length ? hits[hits.length - 1]._id : null,
            value: hits.length ? hits[hits.length - 1]._id : null,
            limit: 3,
            total: total.value,
            records: hits.map((item) => ({
                _id: item._id,
                ...item._source,
            })),
        };
        return result;
    }
}
exports.default = OpenSearchImpl;
//# sourceMappingURL=OpenSearchImpl.js.map