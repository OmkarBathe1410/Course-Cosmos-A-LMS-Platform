// Import Mongoose library and its components
import mongoose, { Document, Schema, Model } from "mongoose";

// Define the INotification interface that extends Mongoose Document interface
export interface INotification extends Document {
  // Title of the notification
  title: string;

  // Content of the notification
  message: string;

  // Status of the notification (defaults to "unread")
  status: string;

  // User ID for the recipient of the notification
  userId: string;
}

// Create a Mongoose Schema object for the INotification interface
const notificationSchema = new Schema<INotification>(
  {
    // Define the title field (required)
    title: {
      type: String,
      required: true,
    },

    // Define the message field (required)
    message: {
      type: String,
      required: true,
    },

    // Define the status field (required, defaults to "unread")
    status: {
      type: String,
      required: true,
      default: "unread",
    },
  },
  // Enable timestamps for tracking createdAt and updatedAt fields
  { timestamps: true }
);

// Create a Mongoose Model object using the notificationSchema and the "Notification" model name
const NotificationModel: Model<INotification> = mongoose.model(
  "Notification",
  notificationSchema
);

// Export the NotificationModel for use in other parts of the application
export default NotificationModel;