"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchDTO = exports.ExistQuery = exports.SortByType = void 0;
const class_validator_1 = require("class-validator");
const Address_1 = __importDefault(require("../Address"));
const sortPriceScript_1 = __importDefault(require("./sortPriceScript"));
const AGGREGATION_BUCKET_MAX_SIZE = 50;
const FETCH_MAX_SIZE = 10000;
var SortByType;
(function (SortByType) {
    SortByType["Price"] = "Price";
    SortByType["Popular"] = "Popular";
    SortByType["NewListing"] = "NewListing";
    SortByType["Transfer"] = "Transfer";
    SortByType["Like"] = "Like";
})(SortByType = exports.SortByType || (exports.SortByType = {}));
var ExistQuery;
(function (ExistQuery) {
    ExistQuery["Exist"] = "$exist";
    ExistQuery["NotExist"] = "$not_exist";
})(ExistQuery = exports.ExistQuery || (exports.ExistQuery = {}));
class SearchDTO {
    count;
    from;
    total;
    searchString;
    orOperations;
    andOperations;
    rangeFilters;
    sortBy;
    sortAscending;
    fieldKeysForGroupBy;
    fieldKeysForRange;
    searchAfterParam;
    static priceScript = sortPriceScript_1.default;
    static defaultSortList = [
        { 'order.sale.createdAt': 'desc' },
        { 'order.offer.highestOfferCreatedAt': 'desc' },
        { 'order.auction.createdAt': 'desc' },
        { lastTransferredAt: 'desc' },
    ];
    static assetFilters = [];
    static burntFilters = [
        {
            term: { owner: Address_1.default.nullAddress.value },
        },
    ];
    static defaultExceptFilter = SearchDTO.burntFilters;
    static SortBy = {
        Price: ['order.sale.price'],
        Popular: ['likeCount', 'order.lastSoldInfo.soldAt', 'order.offer.offerTotalCount'],
        NewListing: ['order.sale.createdAt'],
        Transfer: ['lastTransferredAt'],
        Like: ['likeCount'],
    };
    constructor(param) {
        this.count = param.count;
        this.from = param.from;
        this.total = param.count + param.from;
        this.searchString = param.searchString;
        this.orOperations = param.orOperations;
        this.andOperations = param.andOperations;
        this.rangeFilters = param.rangeFilters;
        this.sortBy = param.sortBy;
        this.sortAscending = param.sortAscending;
        this.fieldKeysForGroupBy = param.fieldKeysForGroupBy;
        this.fieldKeysForRange = param.fieldKeysForRange;
        this.searchAfterParam = param.searchAfterParam;
    }
    mergeFilters() {
        const shouldBundles = this.orOperations ? this.orOperations.map((orOperation) => ({
            bool: {
                should: [
                    ...this.parseMatch(orOperation),
                    ...this.parseExist(orOperation),
                ],
                minimum_should_match: orOperation?.length > 0 ? 1 : 0,
            },
        })) : [];
        return [
            ...shouldBundles,
            ...this.parseMatch(this.andOperations),
            ...this.parseRange(this.rangeFilters),
        ];
    }
    parseFieldKeys() {
        const aggs = {};
        const groupAggs = {};
        const rangeAggs = {};
        const filters = this.mergeFilters();
        if (this.fieldKeysForGroupBy) {
            for (const fieldKey of this.fieldKeysForGroupBy) {
                const removedSameField = filters.filter((filter) => fieldKey.replace('.keyword', '') === 'assetId' || JSON.stringify(filter).indexOf(fieldKey.replace('.keyword', '')) === -1);
                const aggs = {};
                aggs[fieldKey] = { terms: { field: fieldKey, size: AGGREGATION_BUCKET_MAX_SIZE } };
                groupAggs[fieldKey] = {
                    filter: {
                        bool: {
                            must: [
                                ...this.getWildCardQuery('name', this.searchString),
                                ...removedSameField,
                                ...this.parseExist(this.andOperations),
                            ],
                            must_not: [
                                ...SearchDTO.defaultExceptFilter,
                                ...this.parseNotExist(this.andOperations),
                            ],
                        },
                    },
                    aggs,
                };
            }
        }
        if (this.fieldKeysForRange) {
            for (const fieldKey of this.fieldKeysForRange) {
                const removedSameField = filters.filter((filter) => fieldKey.replace('.keyword', '') === 'assetId' || JSON.stringify(filter).indexOf(fieldKey.replace('.keyword', '')) === -1);
                const aggs = {};
                aggs[`max_${fieldKey}`] = {
                    max: { field: fieldKey },
                };
                aggs[`min_${fieldKey}`] = {
                    min: { field: fieldKey },
                };
                rangeAggs[fieldKey] = {
                    filter: {
                        bool: {
                            must: [
                                ...this.getWildCardQuery('name', this.searchString),
                                ...removedSameField,
                                ...this.parseExist(this.andOperations),
                            ],
                            must_not: [
                                ...SearchDTO.defaultExceptFilter,
                                ...this.parseNotExist(this.andOperations),
                            ],
                        },
                    },
                    aggs,
                };
            }
        }
        aggs.all_assets = {
            global: {},
            aggs: {
                ...groupAggs,
                ...rangeAggs,
            },
        };
        return aggs;
    }
    parseSortList() {
        const sortList = [];
        if (this.sortBy) {
            SearchDTO.SortBy[this.sortBy].map((e) => sortList.push({ [e]: this.sortAscending ? 'asc' : 'desc' }));
        }
        return sortList;
    }
    getWildCardQuery(key, query) {
        return query
            ? query.split(' ').map((e) => ([
                {
                    wildcard: {
                        [key]: `*${e.toUpperCase()}*`,
                    },
                },
                {
                    wildcard: {
                        [key]: `*${e.toLowerCase()}*`,
                    },
                },
            ])).flat()
            : [];
    }
    parseMatch(filters) {
        return filters
            ? filters
                .filter((filter) => !Object.values(ExistQuery).includes(filter.value))
                .map((filter) => {
                const match = {};
                match[filter.key] = filter.value;
                return { match };
            })
            : [];
    }
    parseExist(filters) {
        return filters
            ? filters
                .filter((filter) => filter.value === ExistQuery.Exist)
                .map((filter) => {
                const exists = {};
                exists.field = filter.key;
                return { exists };
            })
            : [];
    }
    parseNotExist(filters) {
        return filters
            ? filters
                .filter((filter) => filter.value === ExistQuery.NotExist)
                .map((filter) => {
                const exists = {};
                exists.field = filter.key;
                return { exists };
            })
            : [];
    }
    parseRange(filters) {
        return filters
            ? filters.map((filter) => {
                const range = {};
                range[filter.key] = { gte: filter.min, lte: filter.max };
                return { range };
            })
            : [];
    }
    parseSearchBody() {
        return {
            from: this.from,
            size: this.count,
            query: {
                bool: {
                    must: [
                        ...this.getWildCardQuery('name', this.searchString),
                        ...this.mergeFilters(),
                        ...this.parseExist(this.andOperations),
                    ],
                    must_not: [
                        ...SearchDTO.defaultExceptFilter,
                        ...this.parseNotExist(this.andOperations),
                    ],
                },
            },
            track_total_hits: true,
            sort: [...this.parseSortList(), ...SearchDTO.defaultSortList],
            aggs: this.parseFieldKeys(),
        };
    }
    parseSearchBodyIncludeBurn() {
        return {
            from: this.from,
            size: this.count,
            query: {
                bool: {
                    must: [
                        ...this.mergeFilters(),
                    ],
                },
            },
        };
    }
    parseSearchAfterBody() {
        return {
            size: this.count,
            query: {
                bool: {
                    must: [
                        ...this.getWildCardQuery('name', this.searchString),
                        ...this.mergeFilters(),
                        ...this.parseExist(this.andOperations),
                    ],
                    must_not: [
                        ...SearchDTO.defaultExceptFilter,
                        ...this.parseNotExist(this.andOperations),
                    ],
                },
            },
            track_total_hits: true,
            search_after: this.searchAfterParam ? [this.searchAfterParam.value] : undefined,
            sort: [{ _id: 'asc' }],
        };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], SearchDTO.prototype, "count", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Number)
], SearchDTO.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.Max)(FETCH_MAX_SIZE),
    __metadata("design:type", Number)
], SearchDTO.prototype, "total", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchDTO.prototype, "searchString", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SearchDTO.prototype, "orOperations", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SearchDTO.prototype, "andOperations", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SearchDTO.prototype, "rangeFilters", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(SortByType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchDTO.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SearchDTO.prototype, "sortAscending", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SearchDTO.prototype, "fieldKeysForGroupBy", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SearchDTO.prototype, "fieldKeysForRange", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SearchDTO.prototype, "searchAfterParam", void 0);
exports.SearchDTO = SearchDTO;
//# sourceMappingURL=SearchDTO.js.map