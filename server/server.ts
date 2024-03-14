import { app } from "./app";
require("dotenv").config();
import connectDB from "./utils/db";

app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT:${process.env.PORT} successfully!`);
  connectDB();
});
