import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";

// S3 configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer setup
const upload = multer({ storage: multer.memoryStorage() });

// Upload to S3 function
const uploadToS3 = async (req, res) => {
  try {
    const params = {
      Bucket: "indusglobal",
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);

    res.status(200).send({
      message: "File uploaded successfully",
      data,
    });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send(err);
  }
};

export { upload, uploadToS3 };
