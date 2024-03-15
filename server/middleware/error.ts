import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

/**
 * Middleware function to handle errors and provide customized error responses.
 * @param err - The error object.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function in the middleware chain.
 */
export const ErrorMiddleWare = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500; // Set default status code to 500 if not provided.
  err.message = err.message || "Internal Server Error"; // Set default error message if not provided.

  // Handle Invalid MongoDB ID Error:
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400); // Create a new error instance with a 400 status code.
  }

  // Handle Duplicate Mongoose Key Error:
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400); // Create a new error instance with a 400 status code.
  }

  // Handle Invalid JWT Error:
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is Invalid, Try again!";
    err = new ErrorHandler(message, 400); // Create a new error instance with a 400 status code.
  }

  // Handle JWT Token Expired Error:
  if (err.name == "TokenExpiredError") {
    const message = "JSON Web Token Expired, Try again!";
    err = new ErrorHandler(message, 400); // Create a new error instance with a 400 status code.
  }

  // Send the appropriate error response with the status code and error message.
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
