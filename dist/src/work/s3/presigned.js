"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.presignedTest = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const presignedTest = async () => {
    const key = "dev/toon/temp.png";
    const s3 = new aws_sdk_1.default.S3({
        region: "ap-northeast-2",
    });
    const url = s3.getSignedUrl("getObject", {
        Bucket: "webton",
        Key: key,
        Expires: 3600,
    });
    console.log("url >>", url);
    return url;
};
exports.presignedTest = presignedTest;
//# sourceMappingURL=presigned.js.map