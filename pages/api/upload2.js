import { IncomingForm } from "formidable";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
 

  const form = new IncomingForm({
    keepExtensions: true,
    multiples: false
  });

  try {
    
    const [ fields ,files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Formidable parse error:", err);
          return reject(err);
        }
        resolve([fields, files]);
      });
    });

    if (!files.file) {
      console.error("No file found in upload");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = files.file;

    const fileToUpload = Array.isArray(file) ? file[0] : file;
    
    if (!fileToUpload.filepath) {
      console.error("File path is missing in file object");
      return res.status(400).json({ error: "Invalid file upload" });
    }

    const fileContent = fs.readFileSync(fileToUpload.filepath);

    const originalFilename = fileToUpload.originalFilename || 'unnamed';
    const cleanFilename = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `uploads/${Date.now()}_${cleanFilename}`;


    const uploadParams = {
      Bucket: "atharva102050",
      Key: key,
      Body: fileContent,
      ContentType: fileToUpload.mimetype || 'application/octet-stream',
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const url = `https://${uploadParams.Bucket}.s3.ap-south-1.amazonaws.com/${key}`;
    return res.status(200).json({ urls: url });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ 
      error: "Upload failed", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}