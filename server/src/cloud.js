import { S3 } from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


const uploadFile = (path, stream) => {
  // call S3 to retrieve upload file to specified bucket
  var uploadParams = { Bucket: process.env.bucketName, Key: path, Body: stream };

  s3.upload(uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    }
    if (data) {
      console.log("Upload Success", data.Location);
    }
  });
}

export {uploadFile}