// // lib/s3.js
// import AWS from 'aws-sdk';

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region:  process.env.AWS_REGION,
// });

// const s3 = new AWS.S3();
// export default s3;

import { S3Client } from "@aws-sdk/client-s3";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // 👈 Important! because we'll manually parse it
  },
};

const s3 = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req,res) {
    
    const form = formidable({ multiples: false });

}
