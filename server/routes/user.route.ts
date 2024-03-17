import express from "express";
import { registrationUser } from "../controllers/user.controller";

// Create a new router instance for user-related routes
const userRouter = express.Router();

// Handle POST requests to "/registration" endpoint by calling registrationUser controller function
userRouter.post("/registration", registrationUser);

// Export the userRouter to be used in the main application
export default userRouter;
