import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getCourseAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
} from "../controllers/analytics.controller";

// Instantiate an Express Router for analytics endpoints
const analyticsRouter = express.Router();

// Define a GET route for user analytics, accessible by authenticated admins only
analyticsRouter.get(
  "/get-users-analytics",
  isAuthenticated, // Ensure user is authenticated
  authorizeRoles("admin"), // Ensure user has the "admin" role
  getUserAnalytics // Handle retrieving user analytics data
);

// Define a GET route for course analytics, accessible by authenticated admins only
analyticsRouter.get(
  "/get-courses-analytics",
  isAuthenticated, // Ensure user is authenticated
  authorizeRoles("admin"), // Ensure user has the "admin" role
  getCourseAnalytics // Handle retrieving course analytics data
);

// Define a GET route for order analytics, accessible by authenticated admins only
analyticsRouter.get(
  "/get-orders-analytics",
  isAuthenticated, // Ensure user is authenticated
  authorizeRoles("admin"), // Ensure user has the "admin" role
  getOrderAnalytics // Handle retrieving order analytics data
);

// Export the analyticsRouter for use elsewhere in the application
export default analyticsRouter;
