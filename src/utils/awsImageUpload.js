
 import AWS from "aws-sdk"
 import multer from "multer"
// AWS configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// S3 instance
const s3 = new AWS.S3();

// Multer setup
const upload = multer({ storage: multer.memoryStorage() });

// Upload to S3 function
const uploadToS3 = (req, res) => {
  const params = {
    Bucket: 'indusglobal',
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  };

  s3.upload(params, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(data);
  });
};

export  { upload, uploadToS3 };
