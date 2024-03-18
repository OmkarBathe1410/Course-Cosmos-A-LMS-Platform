import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
require("dotenv").config();
import ejs from "ejs";
import path from "path";
import sendEmail from "../utils/sendEmail";

// Define the structure of the registration request body
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

// Controller function to handle user registration
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      // Check if the email already exists in the database
      const isEmailExist = await userModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email Already Exist", 400));
      }

      // Create a user object with registration details
      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      // Generate an activation token for email verification
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };

      // Render the email template for activation mail
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        // Send activation email to the user
        await sendEmail({
          email: user.email,
          subject: "Activate your Course Cosmos Account",
          template: "activation-mail.ejs",
          data,
        });

        // Respond with success message and activation token
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

// Interface for the activation token structure
interface IActivationToken {
  token: string;
  activationCode: string;
}

// Function to create an activation token for email verification
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

// Interface for the activation request body
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

// Controller function to activate a user account
export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      // Verify the activation token and extract user details
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      // Check if the activation code matches
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid Activation Code", 400));
      }

      const { name, email, password } = newUser.user;
      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("User already exist!", 400));
      }

      // Create a new user in the database
      const user = await userModel.create({
        name,
        email,
        password,
      });

      // Respond with success message
      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
