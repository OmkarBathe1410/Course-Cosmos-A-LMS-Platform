import express from "express";
import { ErrorMiddleWare } from "./middleware/error";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";

require("dotenv").config();

export const app = express();

// Parse incoming requests with JSON payloads and set payload size limit to 50mb
app.use(express.json({ limit: "50mb" }));

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());

// Enable CORS with the specified origin from environment variables
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// Mount the userRouter under the "/api/v1" path prefix
app.use("/api/v1", userRouter, courseRouter);

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

// Apply custom error handling middleware to handle errors
app.use(ErrorMiddleWare);

export default app;
