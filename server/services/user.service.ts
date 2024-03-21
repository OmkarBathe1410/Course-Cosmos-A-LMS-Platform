import { Response } from "express"; // Import the Response object type from the 'express' package
import { redis } from "../utils/redis"; // Import the redis client instance from the '../utils/redis' module
import userModel from "../models/user.model"; // Import the userModel from the '../models/user.model' module
// Define an asynchronous function getUserById that takes a user's ID and an Express.js Response object as parameters
export const getUserById = async (id: string, res: Response) => {
  // Use the redis client instance to fetch the user data from the Redis database based on the provided user ID
  const userJSON = await redis.get(id);

  // Check if the user data exists in the Redis database
  if (userJSON) {
    // Parse the user data from a JSON string to a JavaScript object
    const user = JSON.parse(userJSON);

    // Send a JSON response with a status code of 201 (indicating success in this context) and the user object
    res.status(201).json({
      success: true,
      user,
    });
  }
};

// Define an asynchronous function getAllUsersService that takes an Express.js Response object as a parameter
export const getAllUsersService = async (res: Response) => {
  // Use the userModel to fetch all users from the database and sort them by the 'createdAt' field in descending order
  const users = await userModel.find().sort({ createdAt: -1 });

  // Send a JSON response with a status code of 201 (indicating success in this context) and the array of user objects
  res.status(201).json({
    success: true,
    users,
  });
};
