// Import necessary modules and dependencies
import express from "express";
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updateUserAvatar,
  updateUserInfo,
  updateUserPassword,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

// Create a new Express router
const userRouter = express.Router();

// Route for user registration
userRouter.post("/registration", registrationUser);

// Route for activating a user account
userRouter.post("/activate-user", activateUser);

// Route for user login
userRouter.post("/login", loginUser);

// Route for user logout
userRouter.get("/logout", isAuthenticated, authorizeRoles("admin"), logoutUser);

// Route for updating and refreshing user's access and refresh token
userRouter.get("/refresh", updateAccessToken);

// Route for retrieving user info
userRouter.get("/me", isAuthenticated, getUserInfo);

// Route for authentication through socials
userRouter.get("/social-auth", socialAuth);

// Route to update user information
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);

// Route to update user password
userRouter.put("/update-user-password", isAuthenticated, updateUserPassword);

// Route to update user avatar
userRouter.put("/update-user-avatar", isAuthenticated, updateUserAvatar); // Export the user router for use in the main application

export default userRouter;
