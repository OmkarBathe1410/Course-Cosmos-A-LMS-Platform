"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
require("dotenv").config();
const redis_1 = require("./redis");
// Parse environment variables for token expiration times
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);
// Define options for access token
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
// Define options for refresh token
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
// Function to send tokens to the user
const sendToken = (user, statusCode, res) => {
    // Generate access and refresh tokens for the user
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();
    // Store user session in Redis
    redis_1.redis.set(user._id, JSON.stringify(user));
    // Set secure option for access token in production environment
    if (process.env.NODE_ENV === "production") {
        exports.accessTokenOptions.secure = true;
    }
    // Set cookies with access and refresh tokens
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    // Send success response with user details and access token
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};
exports.sendToken = sendToken;
