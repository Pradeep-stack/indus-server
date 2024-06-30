import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 4000;
// for env configaration  also add in scripts  "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
dotenv.config({
  path: "./env",
});

// connectDB()

// for db connect
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port : ${PORT} `);
    });
  })
  .catch((error) => {
    console.log("DTABASE connection error !!!", error);
  });

// const app = express();

// app.get("/", (req, res) => {
//   res.send("hello pk");
// });

// app.listen(PORT, console.log(`app listing on ${PORT}`));
