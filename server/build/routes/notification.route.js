"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Import the Express.js library
const auth_1 = require("../middleware/auth"); // Import authentication and authorization middleware functions
const notification_controller_1 = require("../controllers/notification.controller"); // Import functions for retrieving and updating notifications
const notificationRoute = express_1.default.Router(); // Initialize a new Express Router object
// Set up a GET route for retrieving all notifications with required authentication and authorization
notificationRoute.get("/get-all-notifications", auth_1.isAuthenticated, // Middleware function to ensure the user is authenticated
(0, auth_1.authorizeRoles)("admin"), // Middleware function to authorize users with the "admin" role
notification_controller_1.getNotification // Function to handle the request and retrieve notifications
);
// Set up a PUT route for updating a notification with required authentication and authorization
notificationRoute.put("/update-notification/:id", auth_1.isAuthenticated, // Middleware function to ensure the user is authenticated
(0, auth_1.authorizeRoles)("admin"), // Middleware function to authorize users with the "admin" role
notification_controller_1.updateNotification // Function to handle the request and update the notification
);
exports.default = notificationRoute; // Export the configured Router object for use in other parts of the application
