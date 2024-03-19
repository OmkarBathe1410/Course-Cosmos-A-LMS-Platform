import { Request } from "express";
import { IUser } from "../models/user.model";

// Extend the Express Request interface to include a user property of type IUser
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
