// Import necessary modules and dependencies
import express from "express";
import {
  activateUser,
  loginUser,
  logoutUser,
  registrationUser,
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

// Export the user router for use in the main application
export default userRouter;
