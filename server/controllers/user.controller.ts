// Import necessary modules and dependencies
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
require("dotenv").config();
import ejs from "ejs";
import path from "path";
import sendEmail from "../utils/sendEmail";
import { sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";

// Define interface for user registration body
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

// Registration user function
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      // Check if email already exists
      const isEmailExist = await userModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email Already Exist", 400));
      }

      // Create user object
      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      // Generate activation token
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };

      // Render activation email template
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        // Send activation email
        await sendEmail({
          email: user.email,
          subject: "Activate your Course Cosmos Account",
          template: "activation-mail.ejs",
          data,
        });

        // Return success response
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your Course Cosmos account!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Define interface for activation token
interface IActivationToken {
  token: string;
  activationCode: string;
}

// Create activation token function
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// Define interface for activation request
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

// Activate user function
export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      // Verify activation token and code
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      // Check activation code validity
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid Activation Code", 400));
      }

      // Create user in the database
      const { name, email, password } = newUser.user;
      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("User already exist!", 400));
      }

      const user = await userModel.create({
        name,
        email,
        password,
      });

      // Return success response
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Define interface for login request
interface ILoginRequest {
  email: string;
  password: string;
}

// Login user function
export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      // Validate email and password
      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      // Find user and check password
      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password!", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password!", 400));
      }

      // Send token upon successful login
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Logout user function
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear cookies and delete session from Redis
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      const userId = req.user?._id || "";
      redis.del(userId);

      // Return success response
      res.status(200).json({
        success: true,
        message: "Logged out successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
