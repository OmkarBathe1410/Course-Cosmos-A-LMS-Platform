// Importing the 'app' instance from the './app' file, which contains our Express application setup
import { app } from "./app";
require("dotenv").config();
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";

// Configuring Cloudinary with API credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY,
});

// Starting the Express server to listen on the specified PORT from the environment variables
app.listen(process.env.PORT, () => {
  // Logging a message to the console once the server starts successfully
  console.log(`Server running on PORT:${process.env.PORT} successfully!`);

  // Connecting to the database after the server starts
  connectDB();
});
