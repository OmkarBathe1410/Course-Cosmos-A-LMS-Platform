"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Importing the Express module
const auth_1 = require("../middleware/auth"); // Importing authorization and authentication middleware
const order_controller_1 = require("../controllers/order.controller"); // Importing the createOrder controller function
// Initialize the orderRouter using Express Router
const orderRouter = express_1.default.Router();
// Define the /create-order route with POST method
// The route is protected by the isAuthenticated middleware and invokes the createOrder function when accessed
orderRouter.post("/create-order", auth_1.isAuthenticated, order_controller_1.createOrder);
// Define a GET route "/get-all-orders" using orderRouter
// Call the getAllOrdersForAdmin middleware function to fetch and send all orders as a JSON response
orderRouter.get("/get-all-orders", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), order_controller_1.getAllOrdersForAdmin);
orderRouter.get("/payment/stripepublishablekey", order_controller_1.sendStripePublishableKey);
orderRouter.post("/payment", auth_1.isAuthenticated, order_controller_1.newPayment);
exports.default = orderRouter; // Export the orderRouter to be used in other parts of the application
