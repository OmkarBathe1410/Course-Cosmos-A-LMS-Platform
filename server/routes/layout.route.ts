// Import the necessary dependencies
import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";
import { updateAccessToken } from "../controllers/user.controller";

// Initialize the layoutRouter using Express.js Router
const layoutRouter = express.Router();

// Create a new POST endpoint for creating a layout
layoutRouter.post(
  "/create-layout", // Route URL
  updateAccessToken,
  isAuthenticated, // Middleware function for checking user authentication
  authorizeRoles("admin"), // Middleware function for authorizing only users with "admin" roles
  createLayout // Controller function for creating a layout
);

// Create a new PUT endpoint for editing an existing layout
layoutRouter.put(
  "/edit-layout", // Route URL
  updateAccessToken,
  isAuthenticated, // Middleware function for checking user authentication
  authorizeRoles("admin"), // Middleware function for authorizing only users with "admin" roles
  editLayout // Controller function for editing a layout
);

// Create a new GET endpoint for retrieving layout by type
layoutRouter.get("/get-layout", getLayoutByType);

// Export layoutRouter for use in the main application
export default layoutRouter;
