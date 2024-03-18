import express from "express";
import { activateUser, registrationUser } from "../controllers/user.controller";
const userRouter = express.Router();

// Route to handle user registration
userRouter.post("/registration", registrationUser);

// Route to handle user account activation
userRouter.post("/activate-user", activateUser);

export default userRouter;
