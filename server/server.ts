// Importing the 'app' instance from the './app' file, which contains our Express application setup
import { app } from "./app";

// Loading environment variables from a '.env' file using the 'dotenv' module
require("dotenv").config();

// Importing the 'connectDB' function from the './utils/db' file for connecting to the database
import connectDB from "./utils/db";

// Starting the Express server to listen on the specified PORT from the environment variables
app.listen(process.env.PORT, () => {
  // Logging a message to the console once the server starts successfully
  console.log(`Server running on PORT:${process.env.PORT} successfully!`);

  // Connecting to the database after the server starts
  connectDB();
});
