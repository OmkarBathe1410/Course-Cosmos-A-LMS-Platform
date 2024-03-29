import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import CourseModel from "../models/course.model";
import { createCourse } from "../services/course.service";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import sendEmail from "../utils/sendEmail";
import ejs from "ejs";
import path from "path";

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

/**
 * Interface defining the structure of the data required to add a new question to a course content.
 */
interface IAddQuestionData {
  /** The text of the question. */
  question: string;
  /** The unique identifier of the course. */
  courseId: string;
  /** The unique identifier of the course content. */
  contentId: string;
}

/**
 * An asynchronous function to add a new question to a specified course content in the database.
 */
export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /** Destructure the question, courseId, and contentId from the request body and assert they conform to the IAddQuestionData structure. */
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      /** Try to find the course in the database with the given courseId. */
      const course = await CourseModel.findById(courseId);

      /** Check if contentId is a valid MongoDB Object ID. If not, respond with an error and status code 400. */
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      /** Find the course content with the given contentId within the course. */
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      /** If no course content is found, respond with an error and status code 400. */
      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      /** Create a new question object with the user making the request, the provided question, and an empty array for future question replies. */
      const newQuestion: any = {
        user: req.user,
        question: question,
        questionReplies: [],
      };

      /** Add the new question to the course content's list of questions. */
      courseContent.questions.push(newQuestion);

      // Notification will be added here in upcoming days

      /** Save the updated course to the database. */
      await course?.save();

      /** Send a successful response with HTTP status code 200 and the course data. */
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      /** If any error occurs, call the next function with an ErrorHandler instance, passing the error message and a status code of 500. */
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 * Interface defining the structure of the data required to add an answer to a question within a course content.
 */
interface IAddAnswerData {
  /** The text of the answer. */
  answer: string;
  /** The unique identifier of the course. */
  courseId: string;
  /** The unique identifier of the course content. */
  contentId: string;
  /** The unique identifier of the question. */
  questionId: string;
}

/**
 * An asynchronous function to add a new answer to a specified question within a course content in the database.
 */
export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /**
       * Destructure the answer, courseId, contentId, and questionId from the request body and assert they conform to the IAddAnswerData structure.
       */
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      /** Try to find the course in the database with the given courseId. */
      const course = await CourseModel.findById(courseId);

      /**
       * Check if contentId is a valid MongoDB Object ID.
       * If not, respond with an error and status code 400.
       */
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      /** Find the course content with the given contentId within the course. */
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      /**
       * If no course content is found, respond with an error and status code 400.
       */
      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      /** Find the question with the provided questionId in the course content's list of questions. */
      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );

      /**
       * If no such question is found, respond with an error and status code 400.
       */
      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      /**
       * Create a new answer object with the user making the request and the provided answer.
       */
      const newAnswer: any = {
        user: req.user,
        answer: answer,
      };

      /**
       * Add the new answer to the question's list of replies.
       */
      question?.questionReplies?.push(newAnswer);

      /** Save the updated course to the database. */
      await course?.save();

      /** If the user adding the answer is the same as the user who asked the question, a notification will be added here in upcoming days (currently commented out). */
      if (req.user?._id === question.user._id) {
        // Create a notification.
      } else {
        /** Generate an HTML email template using the ejs library and send an email notification to the user who asked the question,*/
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );
        try {
          /** Send the email notification. If an error occurs, respond with an error and status code 500. */
          await sendEmail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
      /** If no errors occurred, respond with a success message and status code 200, including the course data in the response. */
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      /** If an error occurred, respond with an error and status code 500, using the ErrorHandler to provide the error message. */
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
