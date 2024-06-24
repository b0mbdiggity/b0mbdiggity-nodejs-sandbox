import { Model } from "mongoose";
interface IBundle {
    tokens: any;
    owner: any;
    network: any;
    orderId: any;
    categoryId: any;
    name: any;
    slug: any;
    imageUri: any;
    order: any;
}
declare const BundleModel: Model<IBundle, {}, {}, {}, any>;
export default BundleModel;
