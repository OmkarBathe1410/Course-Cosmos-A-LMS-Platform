"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules and dependencies
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
// Create a new Express router
const userRouter = express_1.default.Router();
// Route for user registration
userRouter.post("/registration", user_controller_1.registrationUser);
// Route for activating a user account
userRouter.post("/activate-user", user_controller_1.activateUser);
// Route for user login
userRouter.post("/login", user_controller_1.loginUser);
// Route for user logout
userRouter.get("/logout", auth_1.isAuthenticated, user_controller_1.logoutUser);
// Route for retrieving user info
userRouter.get("/me", auth_1.isAuthenticated, user_controller_1.getUserInfo);
// Route for authentication through socials
userRouter.post("/social-auth", user_controller_1.socialAuth);
// Route to update user information
userRouter.put("/update-user-info", auth_1.isAuthenticated, user_controller_1.updateUserInfo);
// Route to update user password
userRouter.put("/update-user-password", auth_1.isAuthenticated, user_controller_1.updateUserPassword);
// Route to update user avatar
userRouter.put("/update-user-avatar", auth_1.isAuthenticated, user_controller_1.updateUserAvatar); // Export the user router for use in the main application
// Define a GET route "/get-all-users" using userRouter
// Call the getAllUsersForAdmin middleware function to fetch and send all users as a JSON response
userRouter.get("/get-all-users", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), user_controller_1.getAllUsersForAdmin);
/* Define a PUT route at the path '/update-user' on the userRouter. */
userRouter.put("/update-user", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), user_controller_1.updateUserRole);
/* Define a DELETE route at the path '/delete-user/:id' on the userRouter. The ':id' parameter captures the user ID from the URL. */
userRouter.delete("/delete-user/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), user_controller_1.deleteUser);
exports.default = userRouter;
