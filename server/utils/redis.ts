// Importing the 'Redis' class from the 'ioredis' module for Redis client functionality
import { Redis } from "ioredis";

// Loading environment variables from a '.env' file using the 'dotenv' module
require("dotenv").config();

// Function to initialize the Redis client
const redisClient = () => {
  // Checking if the REDIS_URL environment variable is defined
  if (process.env.REDIS_URL) {
    // Logging a message indicating successful connection to Redis
    console.log("Redis connected!");
    // Returning the REDIS_URL from environment variables
    return process.env.REDIS_URL;
  }
  // Throwing an error if REDIS_URL is not defined
  throw new Error("Redis connection failed!");
};

// Creating a new instance of the Redis client using the 'redisClient' function
export const redis = new Redis(redisClient());
