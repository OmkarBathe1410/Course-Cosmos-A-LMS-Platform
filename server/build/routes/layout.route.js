"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the necessary dependencies
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const layout_controller_1 = require("../controllers/layout.controller");
// Initialize the layoutRouter using Express.js Router
const layoutRouter = express_1.default.Router();
// Create a new POST endpoint for creating a layout
layoutRouter.post("/create-layout", // Route URL
auth_1.isAuthenticated, // Middleware function for checking user authentication
(0, auth_1.authorizeRoles)("admin"), // Middleware function for authorizing only users with "admin" roles
layout_controller_1.createLayout // Controller function for creating a layout
);
// Create a new PUT endpoint for editing an existing layout
layoutRouter.put("/edit-layout", // Route URL
auth_1.isAuthenticated, // Middleware function for checking user authentication
(0, auth_1.authorizeRoles)("admin"), // Middleware function for authorizing only users with "admin" roles
layout_controller_1.editLayout // Controller function for editing a layout
);
// Create a new GET endpoint for retrieving layout by type
layoutRouter.get("/get-layout/:type", layout_controller_1.getLayoutByType);
// Export layoutRouter for use in the main application
exports.default = layoutRouter;
