import { Response } from "express"; // Importing the Express response object
import CourseModel from "../models/course.model"; // Importing the CourseModel for creating a new course
import { CatchAsyncError } from "../middleware/catchAsyncError"; // Importing the CatchAsyncError middleware for handling asynchronous errors

// Define the createCourse function wrapped with the CatchAsyncError middleware
export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    // Create a new course using the provided data
    const course = await CourseModel.create(data);

    // Return a JSON response with a success status and the created course object
    res.status(200).json({
      success: true,
      course,
    });
  }
);

// Define an asynchronous function getAllCoursesService that takes an Express.js Response object as a parameter
export const getAllCoursesService = async (res: Response) => {
  // Use the CourseModel to fetch all courses from the database and sort them by the 'createdAt' field in descending order
  const courses = await CourseModel.find().sort({ createdAt: -1 });

  // Send a JSON response with a status code of 201 (indicating success in this context) and the array of course objects
  res.status(201).json({
    success: true,
    courses,
  });
};
