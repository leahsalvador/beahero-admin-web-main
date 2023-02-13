import S3 from 'react-aws-s3';

export default function ReactS3Client(dirName) {
  const config = {
    bucketName: 'beahero-storage',
    dirName: dirName ? dirName : 'images' /* optional */,
    region: 'us-east-2',
    accessKeyId: 'AKIAJB5O45SAGV2MCHHA',
    secretAccessKey: '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',
  };

  return new S3(config);
}
