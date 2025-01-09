// import mongoose from "mongoose";
// import { DB_NAME } from "../constant.js";

// const connectDB = async () => {
//   try {
//     const connectResponse = await mongoose.connect(
//       `${process.env.DB_URL}/${DB_NAME}`
//     );
//     console.log("CONNECTION SUCCESS: ", connectResponse.connection.host)
//   } catch (error) {
//     console.error("ERROR TO CONNECT DB: ", error);
//     process.exit(1)
//   }
// };

// export default connectDB;

import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const DB_URL = process.env.DB_URL; // Fetch DB_URL from environment variables

    // Ensure the DB_URL includes the correct prefix
    if (!DB_URL.startsWith("mongodb://") && !DB_URL.startsWith("mongodb+srv://")) {
      throw new Error(
        "Invalid DB_URL. It must start with 'mongodb://' or 'mongodb+srv://'"
      );
    }

    // Append the database name if not already included in the URL
    const connectionString = DB_URL.includes(DB_NAME)
      ? DB_URL
      : `${DB_URL}/${DB_NAME}`;

    const connectResponse = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true, // Recommended options for the MongoDB driver
    });

    console.log("CONNECTION SUCCESS: ", connectResponse.connection.host);
  } catch (error) {
    console.error("ERROR TO CONNECT DB: ", error.message);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;

