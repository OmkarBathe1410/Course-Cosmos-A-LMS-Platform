"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsersForAdmin = exports.updateUserAvatar = exports.updateUserPassword = exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.createActivationToken = exports.registrationUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const jwt_1 = require("../utils/jwt");
const redis_1 = require("../utils/redis");
const user_service_1 = require("../services/user.service");
const cloudinary_1 = require("cloudinary");
// Registration user function
exports.registrationUser = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // Check if email already exists
        const isEmailExist = await user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("Email Already Exist", 400));
        }
        // Create user object
        const user = {
            name,
            email,
            password,
        };
        // Generate activation token
        const activationToken = (0, exports.createActivationToken)(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        // Render activation email template
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activation-mail.ejs"), data);
        try {
            // Send activation email
            await (0, sendEmail_1.default)({
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
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// Create activation token function
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({
        user,
        activationCode,
    }, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
// Activate user function
exports.activateUser = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { activation_token, activation_code } = req.body;
        // Verify activation token and code
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        // Check activation code validity
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default("Invalid Activation Code", 400));
        }
        // Create user in the database
        const { name, email, password } = newUser.user;
        const existUser = await user_model_1.default.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler_1.default("User already exist!", 400));
        }
        const user = await user_model_1.default.create({
            name,
            email,
            password,
        });
        // Return success response
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// Login user function
exports.loginUser = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Validate email and password
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please enter email and password", 400));
        }
        // Find user and check password
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("Invalid email or password!", 400));
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid email or password!", 400));
        }
        // Send token upon successful login
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// Logout user function
exports.logoutUser = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Clear cookies and delete session from Redis
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        const userId = req.user?._id;
        redis_1.redis.del(userId);
        // Return success response
        res.status(200).json({
            success: true,
            message: "Logged out successfully!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateAccessToken = (0, catchAsyncError_1.CatchAsyncError)(
// CatchAsyncError is likely a utility function to handle asynchronous errors
async (req, res, next) => {
    try {
        // Retrieve the refresh token from the request cookies
        const refresh_token = req.cookies.refresh_token;
        // Verify and decode the refresh token using the JSON Web Token (JWT) library and the secret key
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        // Define an error message
        const message = "Could not refresh token";
        // If the refresh token is not valid or cannot be decoded, return a 400 error response
        if (!decoded) {
            return next(new ErrorHandler_1.default(message, 400));
        }
        // Retrieve the user's session data from a Redis database using the decoded user ID
        const session = await redis_1.redis.get(decoded.id);
        // If the session data is not found, return a 400 error response prompting the user to log in
        if (!session) {
            return next(new ErrorHandler_1.default("Please login to access this resource", 400));
        }
        // Parse the session data as a JSON object to get the user object
        const user = JSON.parse(session);
        // Generate a new access token using the JWT library and the secret key
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
            expiresIn: "5m", // Set the access token to expire in 5 minutes
        });
        // Generate a new refresh token using the JWT library and the secret key
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
            expiresIn: "3d", // Set the refresh token to expire in 3 days
        });
        // Attach the user object to the request object
        req.user = user;
        // Set the updated access token and refresh token as cookies in the HTTP response
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        // Store the user's session data back in the Redis database with an expiration of 7 days (604800 seconds)
        await redis_1.redis.set(user._id, JSON.stringify(user), "EX", 604800);
        return next();
    }
    catch (error) {
        // If an error occurs during the process, return a 400 error response with the error message
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// Retrieves user information based on the user's ID
exports.getUserInfo = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Retrieve the user's ID from the user object attached to the request (req.user)
        const userId = req.user?._id;
        // Call the getUserById function (defined elsewhere in the codebase) with the user's ID and the Express.js Response object (res)
        (0, user_service_1.getUserById)(userId, res);
    }
    catch (error) {
        // If an error occurs during the execution of getUserById, catch the error and pass it to the next function with an ErrorHandler instance
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// For handling user authentication through a social media provider
exports.socialAuth = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Extract the user's email, name, and avatar from the request body, assuming the structure matches the ISocialAuthBody interface
        const { email, name, avatar } = req.body;
        // Attempt to find an existing user in the database based on the provided email
        const user = await user_model_1.default.findOne({ email });
        // If no user is found, create a new user in the database with the provided email, name, and avatar
        if (!user) {
            const newUser = await user_model_1.default.create({
                email,
                name,
                avatar,
                sociallyAuth: true,
            });
            // Call the sendToken function with the newly created user, an HTTP status code of 200 (OK), and the Response object (res) to send an authentication token to the user
            (0, jwt_1.sendToken)(newUser, 200, res);
        }
        // If a user is found in the database, call the sendToken function with the existing user, an HTTP status code of 200 (OK), and the Response object (res) to send an authentication token to the user
        else {
            user.sociallyAuth = true; // Set sociallyAuth to true for existing users
            await user.save();
            (0, jwt_1.sendToken)(user, 200, res);
        }
    }
    catch (error) {
        // If any errors occur during the execution of the function, catch them and pass them to the next function with an ErrorHandler instance
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
/**
 * Function to update a user's name and email information.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 */
exports.updateUserInfo = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Destructuring name and email from the request body
        const { name } = req.body;
        const userId = req.user?._id;
        // Finding the user by ID
        const user = await user_model_1.default.findById(userId);
        // Checking if name is provided and user exists
        if (name && user) {
            // Updating user's name
            user.name = name;
        }
        // Saving the updated user information
        await user?.save();
        // Updating user data in Redis cache
        await redis_1.redis.set(userId, JSON.stringify(user));
        // Sending a success response with the updated user information
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        // Handling any errors that occur during the process
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
/**
 * Function to update a user's password securely.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 */
exports.updateUserPassword = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Destructuring oldPassword and newPassword from the request body
        const { oldPassword, newPassword } = req.body;
        // Checking if both oldPassword and newPassword are provided
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler_1.default("Please enter old and new password!", 400));
        }
        // Finding the user by ID and selecting the password field
        const user = await user_model_1.default.findById(req.user?._id).select("+password");
        // Handling case where user or password is not found
        if (user?.password === undefined) {
            return next(new ErrorHandler_1.default("Invalid User!", 400));
        }
        // Comparing the old password provided with the user's current password
        const isPasswordMatch = await user?.comparePassword(oldPassword);
        // Handling case where old password does not match
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid Old Password!", 400));
        }
        // Updating the user's password with the new password
        user.password = newPassword;
        // Saving the updated user information
        await user.save();
        // Updating user data in Redis cache
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        // Sending a success response with the updated user information
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        // Handling any errors that occur during the process
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
/**
 * Function to update a user's avatar using Cloudinary service.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction for error handling
 */
exports.updateUserAvatar = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Destructuring avatar from the request body
        const { avatar } = req.body;
        const userId = req.user?._id;
        // Finding the user by ID
        const user = await user_model_1.default.findById(userId);
        // Checking if avatar is provided and user exists
        if (avatar && user) {
            // Handling existing avatar deletion and uploading new avatar to Cloudinary
            if (user?.avatar?.public_id) {
                // Deleting existing avatar from Cloudinary
                await cloudinary_1.v2.uploader.destroy(user?.avatar?.public_id);
                // Uploading new avatar to Cloudinary with specified settings
                const myCloud = await cloudinary_1.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                // Updating user's avatar information with new Cloudinary details
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            else {
                // Uploading new avatar to Cloudinary if no existing avatar found
                const myCloud = await cloudinary_1.v2.uploader.upload(avatar, {
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
        await redis_1.redis.set(userId, JSON.stringify(user));
        // Sending a success response with the updated user information
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        // Handling any errors that occur during the process
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// Define an asynchronous function getAllUsersForAdmin wrapped with CatchAsyncError to handle any errors
exports.getAllUsersForAdmin = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // Call getAllUsersService to fetch and send all users as a JSON response
        (0, user_service_1.getAllUsersService)(res);
    }
    catch (error) {
        // If an error occurs, create a new ErrorHandler with the error message and status code 400 (Bad Request)
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
/* This asynchronous function updates the user role and handles errors. */
exports.updateUserRole = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        /* Extract the id and role from the request body. */
        const { email, role } = req.body;
        const isUserExist = await user_model_1.default.findOne({ email });
        if (isUserExist) {
            /* Call the updateUserRoleService function with the id, role, and response object. */
            (0, user_service_1.updateUserRoleService)(email, role, res);
        }
        else {
            res.status(400).json({
                success: false,
                message: "User not found!",
            });
        }
    }
    catch (error) {
        /* Handle the error by creating an ErrorHandler instance with the error message and HTTP status code 400 (Bad Request), and pass it to next(). */
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
/* This asynchronous function deletes a user and handles errors. */
exports.deleteUser = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        /* Extract the id from the request parameters. */
        const { id } = req.params;
        /* Find the user with the given id. */
        const user = await user_model_1.default.findById(id);
        /* Check if the user exists. */
        if (!user) {
            /* If the user does not exist, create an ErrorHandler instance with the error message "User not found!" and HTTP status code 404 (Not Found), and pass it to next(). */
            return next(new ErrorHandler_1.default("User not found!", 404));
        }
        /* Delete the user with the given id. */
        await user.deleteOne({ id });
        /* Delete the user from Redis cache. */
        await redis_1.redis.del(id);
        /* Set the HTTP status code to 200 (OK) and send a JSON response with a success message. */
        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
        });
    }
    catch (error) {
        /* Handle the error by creating an ErrorHandler instance with the error message and HTTP status code 400 (Bad Request), and pass it to next(). */
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
