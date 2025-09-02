// app.js 
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import path from 'path';
import { __dirname } from './utils/dirname.js';
import ytdl from 'ytdl-core';
import { swaggerDocs } from "./swagger.js";
const app = express()

app.use(cors({
  origin: "*",
  credentials: true
}))
app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ extended: true, limit: "5mb" }))
app.use(express.static("public"))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'
import videoRouter from "./routes/video.routes.js"
import categoryRouter from "./routes/category.routes.js"
import productRouter from "./routes/product.route.js"
import packagesRoutes from "./routes/packages.routes.js"
import { upload, uploadToS3, generateDownloadUrl } from './utils/awsImageUpload.js';
import exposuerRouter from "./routes/expouser.routes.js"
import cartRouter from "./routes/cart.routes.js"
// import phoneRouter from "./routes/phonepe.routes.js"
import razorpayRouter from "./routes/razorpay.routes.js"
import utilityRouter from "./routes/utility.routes.js"
//routes declaration
app.use("/api/v1", userRouter)
app.use("/api/v1", videoRouter)
app.use("/api/v1", categoryRouter)
app.use("/api/v1", productRouter)
app.use("/api/v1/packages", packagesRoutes);
app.use("/api/v1/expo", exposuerRouter)
app.use("/api/v1", cartRouter)
// app.use("/payment", phoneRouter)
app.use("/payment", razorpayRouter)
app.use("/api/v1", utilityRouter)

//multer setup
app.post('/upload', upload.single('image'), uploadToS3);
// server.js
app.get("/secure-download", (req, res) => {
  const { url } = req.query;

  try {
    const downloadUrl = generateDownloadUrl(url);
    res.json({ url: downloadUrl });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate secure URL" });
  }
});

// youtube video download
app.get('/download', (req, res) => {
  const videoUrl = req.query.url;

  if (!ytdl.validateURL(videoUrl)) {
    return res.status(400).send('Invalid URL');
  }

  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  ytdl(videoUrl, { format: 'mp4' }).pipe(res);
});

// ✅ Initialize Swagger Docs
swaggerDocs(app);
console.log("db url:", process.env.DB_URL);

export { app }

