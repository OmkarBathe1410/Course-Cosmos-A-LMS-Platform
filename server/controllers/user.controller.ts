import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
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

// Handle user registration with error catching middleware
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

      // Render the email template using EJS
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        // Send the activation email to the user
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

// Define the structure of the activation token
interface IActivationToken {
  token: string;
  activationCode: string;
}

// Create an activation token for email verification
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  // Generate a JWT token with user details and activation code
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
