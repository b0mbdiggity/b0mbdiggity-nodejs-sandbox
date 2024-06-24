import { Moment } from 'moment';
import TokenKey from './TokenKey';
export declare enum MetadataType {
    OpenSea = "OpenSea",
    PlayDapp = "PlayDapp",
    LOK = "LOK",
    Cometh = "COMETH"
}
export default class TokenMetadata {
    readonly network: string;
    readonly tokenKey: TokenKey;
    readonly content: any;
    readonly lastCheck: Moment;
    readonly tries: number;
    readonly metadataType: MetadataType;
    constructor(network: string, tokenKey: TokenKey, content: any, lastCheck: Moment, tries: number, metadataType: MetadataType);
}
