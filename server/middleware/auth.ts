import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { updateAccessToken } from "../controllers/user.controller";
require("dotenv").config();

/**
 * Middleware function to check if the user is authenticated.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction to pass control to the next middleware
 */
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve the access token from the request cookies
    const access_token = req.cookies.access_token as string;

    // If access token is not present, return an error response
    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    // Verify and decode the access token using the JWT secret key
    const decoded = jwt.decode(
      access_token,
    ) as JwtPayload;

    // If the token is not valid, return an error response
    if (!decoded) {
      return next(new ErrorHandler("Invalid Access Token", 400));
    }

    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
      try {
        await updateAccessToken(req, res, next);
      } catch (error) {
        return next(error);
      }
    } else {
      // Fetch the user data from the Redis database using the decoded user ID
      const user = await redis.get(decoded.id);

      // If user data is not found, return an error response
      if (!user) {
        return next(
          new ErrorHandler("Please login to access this resource", 400)
        );
      }

      // Parse the user data and attach it to the request object for later use
      req.user = JSON.parse(user);

      // If the user is authenticated, pass control to the next middleware or route handler
      next();
    }
  }
);

/**
 * Middleware function to authorize users based on their roles.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction to pass control to the next middleware
 * @param roles - Array of strings representing the allowed roles
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if the user's role is included in the list of allowed roles
    if (!roles.includes(req.user?.role || "")) {
      // If the user's role is not allowed, return an error response
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }

    // If the user is authorized, pass control to the next middleware or route handler
    next();
  };
};
