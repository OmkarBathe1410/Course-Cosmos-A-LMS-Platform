import express from "express"; // Import the Express.js library
import { authorizeRoles, isAuthenticated } from "../middleware/auth"; // Import authentication and authorization middleware functions
import {
  getNotification,
  updateNotification,
} from "../controllers/notification.controller"; // Import functions for retrieving and updating notifications

const notificationRoute = express.Router(); // Initialize a new Express Router object

// Set up a GET route for retrieving all notifications with required authentication and authorization
notificationRoute.get(
  "/get-all-notifications",
  isAuthenticated, // Middleware function to ensure the user is authenticated
  authorizeRoles("admin"), // Middleware function to authorize users with the "admin" role
  getNotification // Function to handle the request and retrieve notifications
);

// Set up a PUT route for updating a notification with required authentication and authorization
notificationRoute.put(
  "/update-notification/:id",
  isAuthenticated, // Middleware function to ensure the user is authenticated
  authorizeRoles("admin"), // Middleware function to authorize users with the "admin" role
  updateNotification // Function to handle the request and update the notification
);

export default notificationRoute; // Export the configured Router object for use in other parts of the application
