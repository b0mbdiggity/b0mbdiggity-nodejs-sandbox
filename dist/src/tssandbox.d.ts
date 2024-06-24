import "reflect-metadata";
import { FixedNumber } from "ethers";
import { Moment } from "moment";
export declare enum SaleListStatus {
    All = "all",
    OnSale = "onSale",
    Cancelled = "cancelled"
}
export declare class AssetKey {
    network: string;
    address: string;
}
export declare class SalesListRequest {
    assets: AssetKey[];
    startDateISO: Moment;
    endDateISO: Moment;
    status: SaleListStatus;
    searchString?: string;
    private startDate;
    private endDate;
}
export declare const FIXED_NUMBER_100: FixedNumber;
export declare const INVERSE_BASIS_POINT = 10000n;
