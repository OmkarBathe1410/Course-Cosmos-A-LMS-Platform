import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

// Middleware function to handle user analytics requests
export const getUserAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Generate last 12 months' data for users
      const users = await generateLast12MonthsData(userModel);

      // Respond with the generated data and a success status
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      // Pass a new ErrorHandler object to the next middleware function
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Middleware function to handle course analytics requests
export const getCourseAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Generate last 12 months' data for courses
      const courses = await generateLast12MonthsData(CourseModel);

      // Respond with the generated data and a success status
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      // Pass a new ErrorHandler object to the next middleware function
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Middleware function to handle order analytics requests
export const getOrderAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Generate last 12 months' data for orders
      const orders = await generateLast12MonthsData(OrderModel);

      // Respond with the generated data and a success status
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      // Pass a new ErrorHandler object to the next middleware function
      return next(new ErrorHandler(error.message, 500));
    }
  }
);