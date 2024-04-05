import { NextFunction, Response } from "express"; // Importing required types from Express
import OrderModel from "../models/order.model"; // Importing the OrderModel
import { CatchAsyncError } from "../middleware/catchAsyncError"; // Importing the CatchAsyncError middleware for error handling

export const newOrder = CatchAsyncError(
  // Exporting the newOrder function wrapped in CatchAsyncError middleware
  async (data: any, res: Response, next: NextFunction) => {
    // Defining async function with parameters: data, response, and next function
    const order = await OrderModel.create(data); // Creating a new order using the provided data
    res.status(201).json({
      // Sending a JSON response with a 201 status code
      success: true, // Setting the success property to true
      order, // Including the newly created order object in the response
    });
  }
);

// Define an asynchronous function getAllOrdersService
export const getAllOrdersService = async (res: Response) => {
  // Use the OrderModel to fetch all orders from the database and sort them by the 'createdAt' field in descending order
  const orders = await OrderModel.find().sort({ createdAt: -1 });

  // Send a JSON response with a status code of 201 (indicating success in this context) and the array of order objects
  res.status(201).json({
    success: true,
    orders,
  });
};
