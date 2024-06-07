"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotification = exports.getNotification = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model")); // Import the NotificationModel for database operations
const catchAsyncError_1 = require("../middleware/catchAsyncError"); // Import the CatchAsyncError middleware for error handling
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler")); // Import the ErrorHandler for custom error handling
const node_cron_1 = __importDefault(require("node-cron"));
exports.getNotification = (0, catchAsyncError_1.CatchAsyncError)(
// Define an asynchronous function to retrieve notifications from the database
async (req, res, next) => {
    try {
        // Fetch notifications from the database and sort by 'createdAt' field in descending order
        const notifications = await notification_model_1.default.find().sort({
            createdAt: -1,
        });
        // Respond with status code 201 and the retrieved notifications in the response body
        res.status(201).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        // Handle error: Pass the error message and status code 500 to the ErrorHandler
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.updateNotification = (0, catchAsyncError_1.CatchAsyncError)(
// Define an asynchronous function to update the status of a notification in the database
async (req, res, next) => {
    try {
        // Find the notification in the database by its unique identifier
        const notification = await notification_model_1.default.findById(req.params.id);
        // Check if the notification exists
        if (!notification) {
            // If the notification doesn't exist, pass an ErrorHandler with a custom error message and 404 status code
            return next(new ErrorHandler_1.default("Notification not found!", 404));
        }
        else {
            // If the notification exists, update its status to "read" if it's truthy, otherwise leave it unchanged
            notification.status
                ? (notification.status = "read")
                : notification?.status;
        }
        // Save the updated notification to the database
        await notification.save();
        // Fetch all notifications from the database, sorted by 'createdAt' field in descending order
        const notifications = await notification_model_1.default.find().sort({
            createdAt: -1,
        });
        // Respond with status code 200 and the updated notifications in the response body
        res.status(200).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        // Catch any errors that occurred during the process and pass an ErrorHandler with the error message and status code 500
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Schedule a task to run daily at midnight using the cron pattern
node_cron_1.default.schedule("0 0 0 * * *", async () => {
    // Calculate the date and time 30 days ago
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    // Delete all read notifications that were created more than 30 days ago
    await notification_model_1.default.deleteMany({
        status: "read", // Filter for notifications with status "read"
        createdAt: { $lt: thirtyDaysAgo }, // Filter for notifications created before thirtyDaysAgo
    });
    // Log a message to confirm the deletion of old notifications
    console.log("Deleted read notifications");
});
