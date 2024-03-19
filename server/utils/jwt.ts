import { Response } from "express";
require("dotenv").config();
import { IUser } from "../models/user.model";
import { redis } from "./redis";

// Define interface for token options
interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// Parse environment variables for token expiration times
const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);

// Define options for access token
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

// Define options for refresh token
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

// Function to send tokens to the user
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  // Generate access and refresh tokens for the user
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Store user session in Redis
  redis.set(user._id, JSON.stringify(user) as any);

  // Set secure option for access token in production environment
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  // Set cookies with access and refresh tokens
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  // Send success response with user details and access token
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
