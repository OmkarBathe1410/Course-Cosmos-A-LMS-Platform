import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { v2 as cloudinary } from "cloudinary";
import CourseModel from "../models/course.model";
import { createCourse, getAllCoursesService } from "../services/course.service";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import sendEmail from "../utils/sendEmail";
import ejs from "ejs";
import path from "path";
import NotificationModel from "../models/notification.model";
import axios from "axios";

// Handles course thumbnail upload to Cloudinary and creates a new course using the uploaded thumbnail details
export const uploadCourse = CatchAsyncError(
  // Wrapped in CatchAsyncError middleware for error handling
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        const myCloud = await cloudinary.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else {
        data.thumbnail = {
          public_id: "",
          url: "",
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
      const courseId = req.params.id;
      const courseData = (await CourseModel.findById(courseId)) as any;
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail && !thumbnail.startsWith("https")) {
        if (courseData?.thumbnail && courseData?.thumbnail.public_id !== "") {
          await cloudinary.uploader.destroy(courseData?.thumbnail?.public_id);
        }

        const myCloud = await cloudinary.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (thumbnail.startsWith("https")) {
        data.thumbnail = {
          public_id: courseData?.thumbnail.public_id,
          url: courseData?.thumbnail.url,
        };
      }

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7 DAYS

      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      await redis.set("allCourses", JSON.stringify(courses));

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      /** Add the new question to the course content's list of questions. */
      courseContent.questions.push(newQuestion);

      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Received",
        message: `You have a new question in ${courseContent.title}`,
      });

      /** Save the updated course to the database. */
      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800);

      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      await redis.set("allCourses", JSON.stringify(courses));

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      /**
       * Add the new answer to the question's list of replies.
       */
      question?.questionReplies?.push(newAnswer);

      /** Save the updated course to the database. */
      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800);

      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      await redis.set("allCourses", JSON.stringify(courses));

      /** If the user adding the answer is the same as the user who asked the question, a notification will be added. */
      if (req.user?._id === question.user._id) {
        await NotificationModel.create({
          user: req.user?._id,
          title: "New Question Reply Received",
          message: `You have a new question reply in ${courseContent.title}`,
        });
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

interface IAddReviewData {
  review: string; // Interface defining the structure of review data
  rating: number; // Interface defining the structure of rating data
  userId: string; // Interface defining the structure of userId data
}

export const addReview = CatchAsyncError(
  // Exported function to add a review with error handling
  async (req: Request, res: Response, next: NextFunction) => {
    // Asynchronous function to handle adding reviews
    try {
      const courseList = req.user?.courses; // Retrieve the list of courses from the user

      const courseId = req.params.id; // Get the course ID from the request parameters

      const courseExists = courseList?.some(
        // Check if the course exists in the user's course list
        (course: any) => course._id.toString() === courseId.toString()
      );

      if (!courseExists) {
        // If course doesn't exist, return an error
        return next(
          new ErrorHandler("You're not eligible to access this course", 404)
        );
      }

      const course = await CourseModel.findById(courseId); // Find the course by its ID

      const { review, rating } = req.body as IAddReviewData; // Extract review and rating from the request body

      const reviewData: any = {
        // Create review data object
        user: req.user, // Include the user who submitted the review
        comment: review, // Add the review comment
        rating, // Add the rating
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      course?.reviews.push(reviewData); // Add the review data to the course's reviews

      let avg = 0; // Initialize average rating variable

      course?.reviews.forEach((rev: any) => {
        // Calculate the average rating
        avg += rev.rating;
      });

      if (course) {
        // If course exists
        course.ratings = avg / course.reviews.length; // Calculate and update the average rating
      }

      await course?.save(); // Save the updated course data

      await redis.set(courseId, JSON.stringify(course), "EX", 604800);

      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      await redis.set("allCourses", JSON.stringify(courses));

      // Create Notification
      await NotificationModel.create({
        user: req.user?._id,
        title: "New Review Received", // Notification title
        message: `${req.user?.name} has given a review on ${course?.name}`, // Notification message
      });

      res.status(200).json({
        // Send success response with course data
        success: true,
        course,
      });
    } catch (error: any) {
      // Catch any errors that occur
      return next(new ErrorHandler(error.message, 500)); // Return an error response
    }
  }
);

interface IAddReviewReplyData {
  comment: string; // Comment for the review reply
  courseId: string; // ID of the course to which the review belongs
  reviewId: string; // ID of the review to which the reply is being added
}

export const addReplyToReview = CatchAsyncError(
  // Function to add a reply to a review with error handling
  async (req: Request, res: Response, next: NextFunction) => {
    // Async function with request, response, and next function parameters
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewReplyData; // Destructuring comment, courseId, and reviewId from request body

      const course = await CourseModel.findById(courseId); // Finding the course by courseId

      if (!course) {
        // If course not found, return error
        return next(new ErrorHandler("Course not found!", 404));
      }

      const review = course?.reviews?.find(
        // Finding the review within the course
        (rev: any) => rev._id.toString() === reviewId
      );

      if (!review) {
        // If review not found, return error
        return next(new ErrorHandler("Review not found!", 404));
      }

      const reviewReplyData: any = {
        // Creating data for the review reply
        user: req.user, // Assigning the user from request
        comment, // Assigning the comment for the reply
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!review.commentReplies) {
        // If commentReplies array doesn't exist, create it
        review.commentReplies = [];
      }

      review.commentReplies?.push(reviewReplyData); // Adding the reply data to the commentReplies array

      await course?.save(); // Saving the course

      await redis.set(courseId, JSON.stringify(course), "EX", 604800);

      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      await redis.set("allCourses", JSON.stringify(courses));

      res.status(200).json({
        // Sending success response with updated course
        success: true,
        course,
      });
    } catch (error: any) {
      // Catching any errors
      return next(new ErrorHandler(error.message, 500)); // Returning error response
    }
  }
);

// Function to get all courses for an admin with error handling:
export const getAllCoursesForAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Call getAllCoursesService to fetch and send all courses as a JSON response
      getAllCoursesService(res);
    } catch (error: any) {
      // Pass the error message and status code 400 (Bad Request) to the next middleware using ErrorHandler
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/* This asynchronous function deletes a course and handles errors. */
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* Extract the id from the request parameters. */
      const { id } = req.params;

      /* Find the course with the given id. */
      const course = await CourseModel.findById(id);

      /* Check if the course exists. */
      if (!course) {
        /* If the course does not exist, create an ErrorHandler instance with the error message "Course not found!" and HTTP status code 404 (Not Found), and pass it to next(). */
        return next(new ErrorHandler("Course not found!", 404));
      }

      /* Delete the course with the given id. */
      await course.deleteOne({ id });

      /* Delete the course from Redis cache. */
      await redis.del(id);

      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      await redis.set("allCourses", JSON.stringify(courses));

      /* Set the HTTP status code to 200 (OK) and send a JSON response with a success message. */
      res.status(200).json({
        success: true,
        message: "Course deleted successfully!",
      });
    } catch (error: any) {
      /* Handle the error by creating an ErrorHandler instance with the error message and HTTP status code 400 (Bad Request), and pass it to next(). */
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );
      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
