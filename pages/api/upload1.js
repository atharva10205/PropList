// pages/api/upload.js
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new IncomingForm({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parse error' });

    const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];

    try {
      const uploadPromises = uploadedFiles.map(async (file) => {
        const fileContent = fs.readFileSync(file.filepath);
        const uploadParams = {
          Bucket: 'atharva102050',
          Key: `uploads/${Date.now()}_${path.basename(file.originalFilename)}`,
          Body: fileContent,
          ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);

        return `https://${uploadParams.Bucket}.s3.ap-south-1.amazonaws.com/${uploadParams.Key}`;
    });

      const uploadedURLs = await Promise.all(uploadPromises);
      res.status(200).json({ urls: uploadedURLs });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'S3 upload failed', details: error.message });
    }
  });
}
