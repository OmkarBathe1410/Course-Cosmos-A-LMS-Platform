import NotificationModel from "../models/notification.model"; // Import the NotificationModel for database operations
import { CatchAsyncError } from "../middleware/catchAsyncError"; // Import the CatchAsyncError middleware for error handling
import ErrorHandler from "../utils/ErrorHandler"; // Import the ErrorHandler for custom error handling
import { NextFunction, Request, Response } from "express"; // Import Express types for request handling
import cron from "node-cron";

export const getNotification = CatchAsyncError(
  // Define an asynchronous function to retrieve notifications from the database
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch notifications from the database and sort by 'createdAt' field in descending order
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      // Respond with status code 201 and the retrieved notifications in the response body
      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      // Handle error: Pass the error message and status code 500 to the ErrorHandler
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const updateNotification = CatchAsyncError(
  // Define an asynchronous function to update the status of a notification in the database
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Find the notification in the database by its unique identifier
      const notification = await NotificationModel.findById(req.params.id);

      // Check if the notification exists
      if (!notification) {
        // If the notification doesn't exist, pass an ErrorHandler with a custom error message and 404 status code
        return next(new ErrorHandler("Notification not found!", 404));
      } else {
        // If the notification exists, update its status to "read" if it's truthy, otherwise leave it unchanged
        notification.status
          ? (notification.status = "read")
          : notification?.status;
      }

      // Save the updated notification to the database
      await notification.save();

      // Fetch all notifications from the database, sorted by 'createdAt' field in descending order
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      // Respond with status code 200 and the updated notifications in the response body
      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      // Catch any errors that occurred during the process and pass an ErrorHandler with the error message and status code 500
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Schedule a task to run daily at midnight using the cron pattern
cron.schedule("0 0 0 * * *", async () => {
  // Calculate the date and time 30 days ago
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Delete all read notifications that were created more than 30 days ago
  await NotificationModel.deleteMany({
    status: "read", // Filter for notifications with status "read"
    createdAt: { $lt: thirtyDaysAgo }, // Filter for notifications created before thirtyDaysAgo
  });

  // Log a message to confirm the deletion of old notifications
  console.log("Deleted read notifications");
});
