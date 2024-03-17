import express from "express";
import { ErrorMiddleWare } from "./middleware/error";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";

require("dotenv").config(); // Load environment variables from .env file

export const app = express(); // Create an instance of Express application

app.use(express.json({ limit: "50mb" })); // Parse incoming requests with JSON payloads

app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names

app.use(
  cors({
    origin: process.env.ORIGIN, // Enable CORS with the specified origin from environment variables
  })
);

app.use("/api/v1", userRouter);

// Test route to check if the API is working
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// Middleware to handle undefined routes and return a 404 error
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found!`) as any;
  err.statusCode = 404; // Set status code to 404 for not found errors
  next(err); // Pass the error to the error handling middleware
});

app.use(ErrorMiddleWare); // Apply custom error handling middleware to handle errors

export default app; // Export the Express application for external use
