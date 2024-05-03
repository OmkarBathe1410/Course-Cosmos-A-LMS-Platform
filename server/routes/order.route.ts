import express from "express"; // Importing the Express module
import { authorizeRoles, isAuthenticated } from "../middleware/auth"; // Importing authorization and authentication middleware
import {
  createOrder,
  getAllOrdersForAdmin,
} from "../controllers/order.controller"; // Importing the createOrder controller function
import { updateAccessToken } from "../controllers/user.controller";

// Initialize the orderRouter using Express Router
const orderRouter = express.Router();

// Define the /create-order route with POST method
// The route is protected by the isAuthenticated middleware and invokes the createOrder function when accessed
orderRouter.post(
  "/create-order",
  updateAccessToken,
  isAuthenticated,
  createOrder
);

// Define a GET route "/get-all-orders" using orderRouter
// Call the getAllOrdersForAdmin middleware function to fetch and send all orders as a JSON response
orderRouter.get(
  "/get-all-orders",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrdersForAdmin
);

export default orderRouter; // Export the orderRouter to be used in other parts of the application
