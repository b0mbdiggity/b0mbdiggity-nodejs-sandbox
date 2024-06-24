"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSide = exports.INPUT_MATCH = exports.TOPIC = exports.OPENSEARCH_INFO = exports.DB_INFO = void 0;
exports.DB_INFO = {
    user: 'marketplace',
    password: ';Ja>ZL$}&:W9{9L_',
    server: 'playdapp-market-test.cztttxcn8yiq.ap-northeast-2.rds.amazonaws.com',
    database: 'pdmp-polygon-dev',
    connectionTimeout: 30000,
    requestTimeout: 15000,
    pool: {
        min: 1,
        max: 500,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: false,
    },
};
exports.OPENSEARCH_INFO = {
    connection: {
        node: 'https://search-pdmp-opensearch-dev-zbwdv76lprjezqtzda57hjp5fu.ap-northeast-2.es.amazonaws.com:443',
        auth: {
            username: 'spdc-backend',
            password: 'Supertree1!',
        },
        ssl: {
            rejectUnauthorized: true,
        },
    },
    index: 'pdmp-tokens',
    bundleIndex: 'pdmp-bundles',
};
exports.TOPIC = 'c4109843e0b7d514e4c093114b863f8e7d8d9a458c372cd51bfe526b588006c9';
exports.INPUT_MATCH = '0xab';
var OrderSide;
(function (OrderSide) {
    OrderSide[OrderSide["BUY"] = 0] = "BUY";
    OrderSide[OrderSide["SELL"] = 1] = "SELL";
})(OrderSide = exports.OrderSide || (exports.OrderSide = {}));
//# sourceMappingURL=Config.js.map