import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import CourseModel from "../models/course.model";
import { createCourse } from "../services/course.service";
import { redis } from "../utils/redis";

// Handles course thumbnail upload to Cloudinary and creates a new course using the uploaded thumbnail details
export const uploadCourse = CatchAsyncError(
  // Wrapped in CatchAsyncError middleware for error handling
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Handles updating an existing course, including updating the course's thumbnail on Cloudinary if needed
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 * Asynchronous function to handle requests for fetching a single course.
 * Utilizes Redis cache to check for course existence and retrieves course data from the database if not found in cache.
 * Stores fetched course data in Redis cache for 7 days.
 */
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const isCourseExist = await redis.get(courseId);

      if (isCourseExist) {
        const course = JSON.parse(isCourseExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        await redis.set(req.params.id, JSON.stringify(course), "EX", 604800); // 7 Days
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 * Asynchronous function to handle requests for fetching all courses.
 * Checks Redis cache for all courses and retrieves course data from the database if not found in cache.
 * Stores fetched course data in Redis cache for faster access.
 */
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const areCoursesExist = await redis.get("allCourses");
      if (areCoursesExist) {
        const courses = JSON.parse(areCoursesExist);
        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        await redis.set("allCourses", JSON.stringify(courses));

        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Define an asynchronous function getCourseByUser that catches asynchronous errors using CatchAsyncError
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the user's course list from the request object
      const userCourseList = req.user?.courses;

      // Extract the course ID from the request params
      const courseId = req.params.id;

      // Check if the course exists in the user's course list by comparing the course ID
      const isCourseExist = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      // If the course does not exist, return an error response with a custom message and 404 status code
      if (!isCourseExist) {
        return next(
          new ErrorHandler("You're not eligible to access this course", 404)
        );
      }

      // Fetch the course data from the database using CourseModel and the provided course ID
      const course = await CourseModel.findById(courseId);

      // Extract the course content from the fetched course data
      const courseContent = course?.courseData;

      // Send a JSON response with 200 status code and the retrieved course content
      res.status(200).json({
        success: true,
        courseContent,
      });
    } catch (error: any) {
      // If an error occurs, return a custom ErrorHandler object with the error message and 500 status code
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
