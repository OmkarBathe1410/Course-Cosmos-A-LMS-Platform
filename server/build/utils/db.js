"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing the 'mongoose' module for MongoDB object modeling
const mongoose_1 = __importDefault(require("mongoose"));
// Loading environment variables from a '.env' file using the 'dotenv' module
require("dotenv").config();
// Retrieving the database URI from environment variables or setting it to an empty string
const dbUrl = process.env.DB_URI || "";
// Asynchronous function to connect to the database
const connectDB = async () => {
    try {
        // Attempting to connect to the MongoDB database using the retrieved URI
        await mongoose_1.default.connect(dbUrl).then((data) => {
            // Logging a success message with the host of the connected database
            console.log(`Database connected with ${data.connection.host}`);
        });
    }
    catch (error) {
        // Handling any connection errors by logging the error message
        console.log(error.message);
        // Retrying the connection after a delay of 5 seconds (5000 milliseconds)
        setTimeout(connectDB, 5000);
    }
};
// Exporting the 'connectDB' function as the default export
exports.default = connectDB;
