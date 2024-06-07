"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const catchAsyncError_1 = require("./catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../utils/redis");
const user_controller_1 = require("../controllers/user.controller");
require("dotenv").config();
/**
 * Middleware function to check if the user is authenticated.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction to pass control to the next middleware
 */
exports.isAuthenticated = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    // Retrieve the access token from the request cookies
    const access_token = req.cookies.access_token;
    // If access token is not present, return an error response
    if (!access_token) {
        return next(new ErrorHandler_1.default("Please login to access this resource", 400));
    }
    // Verify and decode the access token using the JWT secret key
    const decoded = jsonwebtoken_1.default.decode(access_token);
    // If the token is not valid, return an error response
    if (!decoded) {
        return next(new ErrorHandler_1.default("Invalid Access Token", 400));
    }
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        try {
            await (0, user_controller_1.updateAccessToken)(req, res, next);
        }
        catch (error) {
            return next(error);
        }
    }
    else {
        // Fetch the user data from the Redis database using the decoded user ID
        const user = await redis_1.redis.get(decoded.id);
        // If user data is not found, return an error response
        if (!user) {
            return next(new ErrorHandler_1.default("Please login to access this resource", 400));
        }
        // Parse the user data and attach it to the request object for later use
        req.user = JSON.parse(user);
        // If the user is authenticated, pass control to the next middleware or route handler
        next();
    }
});
/**
 * Middleware function to authorize users based on their roles.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction to pass control to the next middleware
 * @param roles - Array of strings representing the allowed roles
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the list of allowed roles
        if (!roles.includes(req.user?.role || "")) {
            // If the user's role is not allowed, return an error response
            return next(new ErrorHandler_1.default(`Role: ${req.user?.role} is not allowed to access this resource`, 403));
        }
        // If the user is authorized, pass control to the next middleware or route handler
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
