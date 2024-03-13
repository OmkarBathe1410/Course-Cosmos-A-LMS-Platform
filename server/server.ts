// We first import the 'app' instance from the './app' file, which likely contains the configuration and routes for our Express application.
import { app } from "./app";

// Next, we use the 'dotenv' module to load environment variables from a '.env' file, allowing us to keep sensitive information separate from our codebase.
require("dotenv").config();


// Then, we start the Express server by calling the 'listen()' method on our 'app' instance, specifying the PORT from the environment variables. 
// Once the server is up and running, a message is logged to the console confirming its successful start.
app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT:${process.env.PORT} successfully!`);
});
