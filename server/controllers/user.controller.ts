// Import necessary modules and dependencies
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
require("dotenv").config();
import ejs from "ejs";
import path from "path";
import sendEmail from "../utils/sendEmail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";
import {v2 as cloudinary} from "cloudinary";

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
      const { name, email, password } = req.body as IRegistrationBody;

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

export const updateAccessToken = CatchAsyncError(
  // CatchAsyncError is likely a utility function to handle asynchronous errors
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Retrieve the refresh token from the request cookies
      const refresh_token = req.cookies.refresh_token;

      // Verify and decode the refresh token using the JSON Web Token (JWT) library and the secret key
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      // Define an error message
      const message = "Could not refresh token";

      // If the refresh token is not valid or cannot be decoded, return a 400 error response
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }

      // Retrieve the user's session data from a Redis database using the decoded user ID
      const session = await redis.get(decoded.id as string);

      // If the session data is not found, return a 400 error response prompting the user to log in
      if (!session) {
        return next(
          new ErrorHandler("Please login to access this resource", 400)
        );
      }

      // Parse the session data as a JSON object to get the user object
      const user = JSON.parse(session);

      // Generate a new access token using the JWT library and the secret key
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m", // Set the access token to expire in 5 minutes
        }
      );

      // Generate a new refresh token using the JWT library and the secret key
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d", // Set the refresh token to expire in 3 days
        }
      );

      // Attach the user object to the request object
      req.user = user;

      // Set the updated access token and refresh token as cookies in the HTTP response
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      // Store the user's session data back in the Redis database with an expiration of 7 days (604800 seconds)
      redis.set(user._id, JSON.stringify(user), "EX", 604800);

      return next();
    } catch (error: any) {
      // If an error occurs during the process, return a 400 error response with the error message
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Retrieves user information based on the user's ID
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Retrieve the user's ID from the user object attached to the request (req.user)
      const userId = req.user?._id;

      // Call the getUserById function (defined elsewhere in the codebase) with the user's ID and the Express.js Response object (res)
      getUserById(userId, res);
    } catch (error: any) {
      // If an error occurs during the execution of getUserById, catch the error and pass it to the next function with an ErrorHandler instance
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Define an interface ISocialAuthBody specifying the structure of the user data provided by the social media authentication service
interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

// For handling user authentication through a social media provider
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the user's email, name, and avatar from the request body, assuming the structure matches the ISocialAuthBody interface
      const { email, name, avatar } = req.body as ISocialAuthBody;

      // Attempt to find an existing user in the database based on the provided email
      const user = await userModel.findOne({ email });

      // If no user is found, create a new user in the database with the provided email, name, and avatar
      if (!user) {
        const newUser = await userModel.create({
          email,
          name,
          avatar,
          sociallyAuth: true,
        });
        // Call the sendToken function with the newly created user, an HTTP status code of 200 (OK), and the Response object (res) to send an authentication token to the user
        sendToken(newUser, 200, res);
      }
      // If a user is found in the database, call the sendToken function with the existing user, an HTTP status code of 200 (OK), and the Response object (res) to send an authentication token to the user
      else {
        user.sociallyAuth = true; // Set sociallyAuth to true for existing users
        await user.save();
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      // If any errors occur during the execution of the function, catch them and pass them to the next function with an ErrorHandler instance
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 * Interface defining the structure of data required to update a user's information.
 */
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

/**
 * Function to update a user's name and email information.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 */
export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Destructuring name and email from the request body
      const { name } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;

      // Finding the user by ID
      const user = await userModel.findById(userId);

      // Checking if name is provided and user exists
      if (name && user) {
        // Updating user's name
        user.name = name;
      }

      // Saving the updated user information
      await user?.save();

      // Updating user data in Redis cache
      await redis.set(userId, JSON.stringify(user));

      // Sending a success response with the updated user information
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      // Handling any errors that occur during the process
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 * Interface defining the structure of data required to update a user's password.
 */
interface IUpdateUserPassword {
  oldPassword: string;
  newPassword: string;
}

/**
 * Function to update a user's password securely.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 */
export const updateUserPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Destructuring oldPassword and newPassword from the request body
      const { oldPassword, newPassword } = req.body as IUpdateUserPassword;

      // Checking if both oldPassword and newPassword are provided
      if (!oldPassword || !newPassword) {
        return next(
          new ErrorHandler("Please enter old and new password!", 400)
        );
      }

      // Finding the user by ID and selecting the password field
      const user = await userModel.findById(req.user?._id).select("+password");

      // Handling case where user or password is not found
      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid User!", 400));
      }

      // Comparing the old password provided with the user's current password
      const isPasswordMatch = await user?.comparePassword(oldPassword);

      // Handling case where old password does not match
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Old Password!", 400));
      }

      // Updating the user's password with the new password
      user.password = newPassword;

      // Saving the updated user information
      await user.save();

      // Updating user data in Redis cache
      await redis.set(req.user?._id, JSON.stringify(user));

      // Sending a success response with the updated user information
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      // Handling any errors that occur during the process
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 * Interface defining the structure of data required to update a user's avatar.
 */
interface IUpdateUserAvatar {
  avatar: string;
}

/**
 * Function to update a user's avatar using Cloudinary service.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 */
export const updateUserAvatar = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Destructuring avatar from the request body
      const { avatar } = req.body as IUpdateUserAvatar;
      const userId = req.user?._id;

      // Finding the user by ID
      const user = await userModel.findById(userId);

      // Checking if avatar is provided and user exists
      if (avatar && user) {
        // Handling existing avatar deletion and uploading new avatar to Cloudinary
        if (user?.avatar?.public_id) {
          // Deleting existing avatar from Cloudinary
          await cloudinary.uploader.destroy(user?.avatar?.public_id);

          // Uploading new avatar to Cloudinary with specified settings
          const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });

          // Updating user's avatar information with new Cloudinary details
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          // Uploading new avatar to Cloudinary if no existing avatar found
          const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });

          // Updating user's avatar information with new Cloudinary details
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      // Saving the updated user information
      await user?.save();

      // Updating user data in Redis cache
      await redis.set(userId, JSON.stringify(user));

      // Sending a success response with the updated user information
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      // Handling any errors that occur during the process
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Define an asynchronous function getAllUsersForAdmin wrapped with CatchAsyncError to handle any errors
export const getAllUsersForAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Call getAllUsersService to fetch and send all users as a JSON response
      getAllUsersService(res);
    } catch (error: any) {
      // If an error occurs, create a new ErrorHandler with the error message and status code 400 (Bad Request)
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/* This asynchronous function updates the user role and handles errors. */
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* Extract the id and role from the request body. */
      const { email, role } = req.body;
      const isUserExist = await userModel.findOne({ email });

      if (isUserExist) {
        /* Call the updateUserRoleService function with the id, role, and response object. */
        updateUserRoleService(email, role, res);
      } else {
        res.status(400).json({
          success: false,
          message: "User not found!",
        });
      }
    } catch (error: any) {
      /* Handle the error by creating an ErrorHandler instance with the error message and HTTP status code 400 (Bad Request), and pass it to next(). */
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/* This asynchronous function deletes a user and handles errors. */
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* Extract the id from the request parameters. */
      const { id } = req.params;

      /* Find the user with the given id. */
      const user = await userModel.findById(id);

      /* Check if the user exists. */
      if (!user) {
        /* If the user does not exist, create an ErrorHandler instance with the error message "User not found!" and HTTP status code 404 (Not Found), and pass it to next(). */
        return next(new ErrorHandler("User not found!", 404));
      }

      /* Delete the user with the given id. */
      await user.deleteOne({ id });

      /* Delete the user from Redis cache. */
      await redis.del(id);

      /* Set the HTTP status code to 200 (OK) and send a JSON response with a success message. */
      res.status(200).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error: any) {
      /* Handle the error by creating an ErrorHandler instance with the error message and HTTP status code 400 (Bad Request), and pass it to next(). */
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
