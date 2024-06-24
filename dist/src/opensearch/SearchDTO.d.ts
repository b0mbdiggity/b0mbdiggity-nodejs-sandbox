export declare enum SortByType {
    Price = "Price",
    Popular = "Popular",
    NewListing = "NewListing",
    Transfer = "Transfer",
    Like = "Like"
}
export declare enum ExistQuery {
    Exist = "$exist",
    NotExist = "$not_exist"
}
interface MatchFilter {
    key: string;
    value: string;
}
interface RangeFilter {
    key: string;
    min: number;
    max: number;
}
interface Aggregation {
    [key: string]: {
        [key: string]: Object | {
            field: string;
        };
    };
}
export interface SearchAfterParam {
    value: number;
    id: string;
}
export interface SearchParameter {
    count: number;
    from: number;
    searchString: string;
    orOperations: MatchFilter[][];
    andOperations: MatchFilter[];
    rangeFilters: RangeFilter[];
    sortBy: SortByType;
    sortAscending: boolean;
    fieldKeysForGroupBy: string[];
    fieldKeysForRange: string[];
    searchAfterParam: SearchAfterParam;
}
export interface RecordByCursorOutput {
    id: string;
    value: number;
    limit: number;
    total: number;
    records: any[];
}
export declare class SearchDTO {
    readonly count: number;
    readonly from: number;
    private total;
    readonly searchString: string;
    readonly orOperations: MatchFilter[][];
    readonly andOperations: MatchFilter[];
    readonly rangeFilters: RangeFilter[];
    readonly sortBy: SortByType;
    readonly sortAscending: boolean;
    readonly fieldKeysForGroupBy: string[];
    readonly fieldKeysForRange: string[];
    readonly searchAfterParam: SearchAfterParam;
    static readonly priceScript: string;
    static readonly defaultSortList: ({
        'order.sale.createdAt': string;
        'order.offer.highestOfferCreatedAt'?: undefined;
        'order.auction.createdAt'?: undefined;
        lastTransferredAt?: undefined;
    } | {
        'order.offer.highestOfferCreatedAt': string;
        'order.sale.createdAt'?: undefined;
        'order.auction.createdAt'?: undefined;
        lastTransferredAt?: undefined;
    } | {
        'order.auction.createdAt': string;
        'order.sale.createdAt'?: undefined;
        'order.offer.highestOfferCreatedAt'?: undefined;
        lastTransferredAt?: undefined;
    } | {
        lastTransferredAt: string;
        'order.sale.createdAt'?: undefined;
        'order.offer.highestOfferCreatedAt'?: undefined;
        'order.auction.createdAt'?: undefined;
    })[];
    private static readonly assetFilters;
    private static readonly burntFilters;
    static readonly defaultExceptFilter: {
        term: {
            [key: string]: string | number;
        };
    }[];
    static readonly SortBy: {
        [key in SortByType]: Array<string>;
    };
    constructor(param: SearchParameter);
    private mergeFilters;
    private parseFieldKeys;
    private parseSortList;
    getWildCardQuery(key: string, query: string): {
        wildcard: {
            [x: string]: string;
        };
    }[];
    private parseMatch;
    private parseExist;
    private parseNotExist;
    private parseRange;
    parseSearchBody(): {
        from: number;
        size: number;
        query: {
            bool: {
                must: ({
                    match: {
                        [key: string]: string;
                    };
                } | {
                    exists: {
                        field: string;
                    };
                } | {
                    bool: {
                        should: ({
                            match: {
                                [key: string]: string;
                            };
                        } | {
                            exists: {
                                field: string;
                            };
                        })[];
                        minimum_should_match: number;
                    };
                } | {
                    range: {
                        [key: string]: {
                            gte: number;
                            lte: number;
                        };
                    };
                } | {
                    wildcard: {
                        [x: string]: string;
                    };
                })[];
                must_not: ({
                    term: {
                        [key: string]: string | number;
                    };
                } | {
                    exists: {
                        field: string;
                    };
                })[];
            };
        };
        track_total_hits: boolean;
        sort: {
            [key: string]: string | object;
        }[];
        aggs: Aggregation;
    };
    parseSearchBodyIncludeBurn(): {
        from: number;
        size: number;
        query: {
            bool: {
                must: ({
                    match: {
                        [key: string]: string;
                    };
                } | {
                    bool: {
                        should: ({
                            match: {
                                [key: string]: string;
                            };
                        } | {
                            exists: {
                                field: string;
                            };
                        })[];
                        minimum_should_match: number;
                    };
                } | {
                    range: {
                        [key: string]: {
                            gte: number;
                            lte: number;
                        };
                    };
                })[];
            };
        };
    };
    parseSearchAfterBody(): {
        size: number;
        query: {
            bool: {
                must: ({
                    match: {
                        [key: string]: string;
                    };
                } | {
                    exists: {
                        field: string;
                    };
                } | {
                    bool: {
                        should: ({
                            match: {
                                [key: string]: string;
                            };
                        } | {
                            exists: {
                                field: string;
                            };
                        })[];
                        minimum_should_match: number;
                    };
                } | {
                    range: {
                        [key: string]: {
                            gte: number;
                            lte: number;
                        };
                    };
                } | {
                    wildcard: {
                        [x: string]: string;
                    };
                })[];
                must_not: ({
                    term: {
                        [key: string]: string | number;
                    };
                } | {
                    exists: {
                        field: string;
                    };
                })[];
            };
        };
        track_total_hits: boolean;
        search_after: number[];
        sort: {
            _id: string;
        }[];
    };
}
export {};
