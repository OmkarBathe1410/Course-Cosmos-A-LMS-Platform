// Importing the 'express' module to create a web application
import express from "express";

// Importing the 'Request', 'Response', and 'NextFunction' types from the 'express' module
import { Request, Response, NextFunction } from "express";

// Importing the 'cors' module for Cross-Origin Resource Sharing
import cors from "cors";

// Importing the 'cookie-parser' module for parsing cookies
import cookieParser from "cookie-parser";

// Loading environment variables from a '.env' file using the 'dotenv' module
require("dotenv").config();

// Creating an instance of the Express application
export const app = express();

// Middleware to parse JSON request bodies with a limit of 50MB
app.use(express.json({ limit: "50mb" }));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to enable Cross-Origin Resource Sharing (CORS) with the specified origin from environment variables
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// Route to test the API and return a success message
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// Middleware to handle errors for unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found!`) as any;
  err.statusCode = 404;
  next(err);
});
