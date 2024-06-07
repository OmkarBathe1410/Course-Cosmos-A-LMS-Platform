"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersService = exports.newOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model")); // Importing the OrderModel
const catchAsyncError_1 = require("../middleware/catchAsyncError"); // Importing the CatchAsyncError middleware for error handling
exports.newOrder = (0, catchAsyncError_1.CatchAsyncError)(
// Exporting the newOrder function wrapped in CatchAsyncError middleware
async (data, res, next) => {
    // Defining async function with parameters: data, response, and next function
    const order = await order_model_1.default.create(data); // Creating a new order using the provided data
    res.status(201).json({
        // Sending a JSON response with a 201 status code
        success: true, // Setting the success property to true
        order, // Including the newly created order object in the response
    });
});
// Define an asynchronous function getAllOrdersService
const getAllOrdersService = async (res) => {
    // Use the OrderModel to fetch all orders from the database and sort them by the 'createdAt' field in descending order
    const orders = await order_model_1.default.find().sort({ createdAt: -1 });
    // Send a JSON response with a status code of 201 (indicating success in this context) and the array of order objects
    res.status(201).json({
        success: true,
        orders,
    });
};
exports.getAllOrdersService = getAllOrdersService;
