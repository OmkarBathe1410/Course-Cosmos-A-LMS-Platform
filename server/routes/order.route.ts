import express from "express"; // Importing the Express module
import { authorizeRoles, isAuthenticated } from "../middleware/auth"; // Importing authorization and authentication middleware
import {
  createOrder,
  getAllOrdersForAdmin,
  newPayment,
  sendStripePublishableKey,
} from "../controllers/order.controller"; // Importing the createOrder controller function

// Initialize the orderRouter using Express Router
const orderRouter = express.Router();

// Define the /create-order route with POST method
// The route is protected by the isAuthenticated middleware and invokes the createOrder function when accessed
orderRouter.post("/create-order", isAuthenticated, createOrder);

// Define a GET route "/get-all-orders" using orderRouter
// Call the getAllOrdersForAdmin middleware function to fetch and send all orders as a JSON response
orderRouter.get(
  "/get-all-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrdersForAdmin
);

orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

orderRouter.post("/payment", isAuthenticated, newPayment);

export default orderRouter; // Export the orderRouter to be used in other parts of the application
