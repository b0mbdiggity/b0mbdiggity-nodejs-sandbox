import { Model } from "mongoose";
interface INftEvent {
    [key: string]: any;
}
declare const NftEventModel: Model<INftEvent, {}, {}, {}, any>;
export default NftEventModel;
