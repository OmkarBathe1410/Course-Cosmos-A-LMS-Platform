import { Request, Response, NextFunction } from "express"; // Importing required types
import { CatchAsyncError } from "../middleware/catchAsyncError"; // Importing error handling middleware
import ErrorHandler from "../utils/ErrorHandler"; // Importing custom error handler
import userModel from "../models/user.model"; // Importing user model
import { IOrder } from "../models/order.model"; // Importing order model interface
import CourseModel from "../models/course.model"; // Importing course model
import path from "path"; // Importing Node's path module
import ejs from "ejs"; // Importing EJS library for templating
import sendEmail from "../utils/sendEmail"; // Importing sendEmail utility function
import NotificationModel from "../models/notification.model"; // Importing notification model
import { getAllOrdersService, newOrder } from "../services/order.service"; // Importing newOrder function

export const createOrder = CatchAsyncError(
  // Exporting createOrder function wrapped in CatchAsyncError middleware
  async (req: Request, res: Response, next: NextFunction) => {
    // Destructuring request, response, and next function
    try {
      // Starting try block to handle errors
      const { courseId, payment_info } = req.body as IOrder; // Destructuring courseId and payment_info from request body

      const user = await userModel.findById(req.user?._id); // Finding user by ID

      const courseExistsInUser = user?.courses.some(
        // Checking if user already has the course
        (course: any) => course._id.toString() === courseId
      );
      if (courseExistsInUser) {
        // If user has the course, return error
        return next(
          new ErrorHandler("You've already purchased this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId); // Finding course by ID
      if (!course) {
        // If course is not found, return error
        return next(new ErrorHandler("Course not found!", 404));
      }

      const data: any = {
        // Creating order data
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        // Creating data for email
        order: {
          _id: course._id.toString().slice(0, 6),
          user_name: user?.name,
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        // Rendering email template with data
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        // Try block for sending email
        if (user) {
          // If user exists, send email confirmation
          await sendEmail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        // If there's an error sending the email, log it and continue with the order creation
        console.error("Error sending email:", error.message);
      }
      user?.courses.push(course?._id); // Adding the course to the user's list of courses

      await user?.save(); // Saving the updated user

      await NotificationModel.create({
        // Creating a new notification
        user: user?._id,
        title: "New Order",
        message: `You have a new order for ${course?.name} from ${user?.name}`,
      });

      course.purchased ? (course.purchased += 1) : course.purchased; // Incrementing the number of purchases for the course

      await course.save(); // Saving the updated course

      newOrder(data, res, next); // Calling the newOrder function with the order data, response, and next function
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500)); // Returning an error if there's an issue during the process
    }
  }
);

// Define an asynchronous function getAllOrdersForAdmin wrapped with CatchAsyncError to handle any errors
export const getAllOrdersForAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Call getAllOrdersService to fetch and send all orders as a JSON response
      getAllOrdersService(res);
    } catch (error: any) {
      // If an error occurs, create a new ErrorHandler with the error message and status code 400 (Bad Request)
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
