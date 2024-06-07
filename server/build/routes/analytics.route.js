"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const analytics_controller_1 = require("../controllers/analytics.controller");
// Instantiate an Express Router for analytics endpoints
const analyticsRouter = express_1.default.Router();
// Define a GET route for user analytics, accessible by authenticated admins only
analyticsRouter.get("/get-users-analytics", auth_1.isAuthenticated, // Ensure user is authenticated
(0, auth_1.authorizeRoles)("admin"), // Ensure user has the "admin" role
analytics_controller_1.getUserAnalytics // Handle retrieving user analytics data
);
// Define a GET route for course analytics, accessible by authenticated admins only
analyticsRouter.get("/get-courses-analytics", auth_1.isAuthenticated, // Ensure user is authenticated
(0, auth_1.authorizeRoles)("admin"), // Ensure user has the "admin" role
analytics_controller_1.getCourseAnalytics // Handle retrieving course analytics data
);
// Define a GET route for order analytics, accessible by authenticated admins only
analyticsRouter.get("/get-orders-analytics", auth_1.isAuthenticated, // Ensure user is authenticated
(0, auth_1.authorizeRoles)("admin"), // Ensure user has the "admin" role
analytics_controller_1.getOrderAnalytics // Handle retrieving order analytics data
);
// Export the analyticsRouter for use elsewhere in the application
exports.default = analyticsRouter;
