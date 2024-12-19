import AWS from "aws-sdk";

export const presignedTest = async () => {
  const key = "dev/toon/temp.png";

  const s3 = new AWS.S3({
    region: "ap-northeast-2",
  });

  const url = s3.getSignedUrl("getObject", {
    Bucket: "webton",
    Key: key,
    Expires: 3600, // 1h
  });

  console.log("url >>", url);
  return url;
};
