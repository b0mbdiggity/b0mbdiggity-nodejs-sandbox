import { config } from "mssql";
export declare const DB_INFO: config;
export declare const OPENSEARCH_INFO: {
    connection: {
        node: string;
        auth: {
            username: string;
            password: string;
        };
        ssl: {
            rejectUnauthorized: boolean;
        };
    };
    index: string;
    bundleIndex: string;
};
export declare const TOPIC = "c4109843e0b7d514e4c093114b863f8e7d8d9a458c372cd51bfe526b588006c9";
export declare const INPUT_MATCH = "0xab";
export declare enum OrderSide {
    BUY = 0,
    SELL = 1
}
