import express  from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import path from 'path';
import { __dirname } from './utils/dirname.js';
import ytdl from 'ytdl-core';
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"5mb"}))
app.use(express.urlencoded({extended:true, limit:"5mb"}))
// app.use(express.static("public"))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'
import videoRouter from "./routes/video.routes.js"
import categoryRouter from "./routes/category.routes.js"
// import { weekPerHours } from "./middlewares/createSingleObject.js";

//routes declaration
// app.use(weekPerHours)
app.use("/api/v1", userRouter)
app.use("/api/v1", videoRouter)
app.use("/api/v1", categoryRouter)

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    
    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).send('Invalid URL');
    }
  
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(videoUrl, { format: 'mp4' }).pipe(res);
  });
  

export {app}