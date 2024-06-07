"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing the 'app' instance from the './app' file, which contains our Express application setup
const app_1 = require("./app");
require("dotenv").config();
const http_1 = __importDefault(require("http"));
const db_1 = __importDefault(require("./utils/db"));
const cloudinary_1 = require("cloudinary");
const socketServer_1 = require("./socketServer");
const server = http_1.default.createServer(app_1.app);
// Configuring Cloudinary with API credentials from environment variables
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY,
});
(0, socketServer_1.initSocketServer)(server);
// Starting the Express server to listen on the specified PORT from the environment variables
server.listen(process.env.PORT, () => {
    // Logging a message to the console once the server starts successfully
    console.log(`Server running on PORT:${process.env.PORT} successfully!`);
    // Connecting to the database after the server starts
    (0, db_1.default)();
});
